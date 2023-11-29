import psycopg2
import logging
import os
import requests
import json
import datetime
import time
import TAPPconfig as cfg
import time
import preProcUtilities as putil
import traceback
from dateutil import parser
import pandas as pd
UI_SERVER = cfg.getUIServer()
DB_NAME = cfg.getDB_NAME()
S3_UPLOAD_TABLE = cfg.getS3_UPLOAD_TABLE()
PURGE_TABLE = cfg.getPURGE_TABLE()
def getPurgeFiles(documentId:str,fileName:str)->list:
    files = []
    try:
        import glob
        #Delete original pdf/tiff files
        #Delete files from split folder, tifffiles folder, logs, etc.,
        fileName = os.path.basename(fileName)
        PAIGES_CLIENT_SRC = cfg.getpAIgesClientSRC()
        rootFolderPath = cfg.getRootFolderPath()
        localFiles = glob.glob(rootFolderPath + '/*/*' + documentId + '*')
        localRootFolderFiles = glob.glob(rootFolderPath + '/*' + documentId + '*')
        localFiles_filename0 = glob.glob(rootFolderPath + '/*/*' + fileName + '*')
        localFiles_filename1 = glob.glob(rootFolderPath + '/*' + fileName + '*')
        localFiles1 = glob.glob(PAIGES_CLIENT_SRC + '/*/*' + documentId + '*')
        localRootFolderFiles1 = glob.glob(PAIGES_CLIENT_SRC + '/*' + documentId + '*')
        localFiles_filename2 = glob.glob(PAIGES_CLIENT_SRC + '/*/*' + fileName + '*')
        localFiles_filename3 = glob.glob(PAIGES_CLIENT_SRC + '/*' + fileName + '*')
        localFiles_ = localFiles + localRootFolderFiles +localFiles_filename0 +localFiles_filename1
        files = localFiles_ + localRootFolderFiles1 + localFiles_filename2 + localFiles_filename3
        # print("purge files list",localFiles)
        return files
    except Exception as ex:
        print("getPurgeFiles exception",ex)
        return files

def purgeVmFiles(files:list)->dict:
    log = ''
    for file in files:
        try:
            os.remove(file)
            # f["file"] = "Deleted"
            log = log + str(file) + "Deleted"
        except Exception as e:
            log = log + str(file) + str(e)
            #f["file"] = str(e)+"OR File already deleted"
    return log

def downloadDocResult(f_name,documentId,dirPath):
    try:
        endPiont = UI_SERVER + "/document/result/get/" + documentId
        headers = {}
        headers["Content-Type"] = "application/json"
        print("endPiont:",endPiont)
        response = requests.get(endPiont,
                                headers = headers,
                                verify = False)
        print("response ",response)
        if response.status_code != 200:
            return False
        resp = response.json()
        # print("Extracted Data :",resp)
        if str(resp.get('params').get('status')).lower() == "failed":
            return False
        #getting list of header items from doc result
        headerItems = resp.get("result").get("document").get("documentInfo")
        with open(r"fieldMapping.json","r") as f:
            fieldMapping = json.load(f)
        extracted_data = {}
        if headerItems:
            for hdr_item in headerItems:
                f_key = hdr_item.get("fieldId")
                transformed_key = fieldMapping[f_key]
                f_val = hdr_item.get("fieldValue")
                extracted_data[transformed_key] = f_val

        inv_Date = extracted_data.get("invoiceDate")
        if inv_Date:
            try:
                extracted_data["invoiceDate"] = parser.parse(extracted_data.get("invoiceDate"),
                                                                dayfirst = True).date().strftime('%d-%b-%Y')
            except:
                extracted_data["invoiceDate"] = ""
        extracted_data["fileName"] = f_name
        if len(extracted_data)>0:
            fileName = os.path.splitext(f_name)[0] +'.json'
            domp_json = putil.saveTOJson(os.path.join(dirPath,fileName),extracted_data)
            if domp_json is None:
                return False
            return True 
        return False
    except:
        print("Get document result failed exception:",traceback.print_exc())
        return False

## monogDB purging record API call
def purgeMongoDBRecords(documentId:str):
    # ulr = http://52.172.153.247:7777/document/purgeDocument
    """
    {
    "id": "api.document.purge",
    "ver": "1.0",
    "ts": 1660022252453,
    "params": {
        "resmsgid": "",
        "msgid": "e468ef69-064f-4140-ba67-8c924876627e",
        "status": "Success",
        "err": "",
        "errmsg": "",
        "reason": ""
    },
    "responseCode": "OK",
    "result": {
        "documentId": "f52af359-fc3f-43a6-bfef-bc0235299560",
        "Message": "Document Purged successfully"
    }}
    """
    endpoint = "/document/purge" 
    urls = UI_SERVER + endpoint
    #urls = "http://172.22.0.10/document/purge"
    header =  {"Content-Type": "application/json"}
    payload =   {
                    "id": "api.document.purge",
                    "ver": "1.0",
                    "ts": 1659534515,   
                    "params": {"msgid": "e468ef69-064f-4140-ba67-8c924876627e"},
                    "request": {"documentId": "docId"}
                }
    payload["request"]['documentId']= documentId
    payload = json.dumps(payload)
    try:
        # print("URL :",urls,"\nPayload :",payload)
        response = requests.post(urls,
                                 headers = header,
                                 data = payload,
                                 verify = False)
        resp = response.json()
        # print("API response code :",response.status_code,"\nResponse :",response.json())
        if response.status_code == 200:
            if str(resp.get("params").get("status")).lower() == "success":
                return {"status_code":200,"message":"Purge document successful"}
        if response.status_code == 404:
            return {"status_code":response.status_code,"message":"Not found/Already Deleted"}
            
        return {"status_code":500,"message":resp.get("params").get("errmsg")}
    except Exception as ex:
        print("mongoDB purge record exception",ex)
        return {"status_code":500,"message":"Failed with error msg ->"+str(ex)}


# Instantiate a BlobServiceClient using a connection string
from azure.storage.blob import BlobServiceClient

connect_str = "DefaultEndpointsProtocol=https;AccountName=submasterstorage;AccountKey=q061i+V0b9DGdgf+YWef1R110gZbKblmTKhWVN5XmeZm4rfl7ATOrPHm40SfxQQHq/Sfc3+Q+NMBQcqow/uYjQ==;EndpointSuffix=core.windows.net"
ocr_pred_container = cfg.getSubscriberId() #"e6ea6f6c-9dca-4fac-a76a-a98af245132d" #

blob_service_client = BlobServiceClient.from_connection_string(connect_str)

# Instantiate a ContainerClient
container_client = blob_service_client.get_container_client(ocr_pred_container)

def delet_blobs(connect_str:str,doc_id:str,blobname:str):
    """
    argumnets:
        conn_str = string
        container = string
        blobName = string
        return [] 
    """
    try:
        blob_service_client = BlobServiceClient.from_connection_string(connect_str)
        container_client = blob_service_client.get_container_client(ocr_pred_container)
        my_blobs = [blob.name for blob in container_client.list_blobs(name_starts_with=doc_id)]
        print("my_blobs :",my_blobs)
        my_blobs.append(blobname)
        print("my_blobs after adding blob :",my_blobs)
        deleted_blobs = container_client.delete_blobs(*my_blobs)
        lst = []
        for de_blb in deleted_blobs:
            if de_blb.status_code in [200,202]:
                lst.append("True")
            else:
                lst.append("False")
        # deleted_blobs = [f.status_code for f in deleted_blobs]
        # print("deleted blob :",lst)
        dic = list(map(lambda i,j : (i,j),my_blobs, lst))    
        print("deleted blobs: ",dic)
        return dic
    except Exception as ex:
        print(ex)
        return []

class PurgeData:
    # def __init__(self,host, port, database, user,password):
    def __init__(self,conn_str):
        # self.host = host
        # self.port = port
        # self.database = database
        # self.user = user
        # self.password = password
        self.conn_str = conn_str
        # Set up logging
        # logging.basicConfig(filename='./fetch_records.log', level=logging.INFO,
        #                     format='%(asctime)s:%(levelname)s:%(message)s')
    def conn_to_db(self):
        logging.info("Connecting Database...")
        try:
            connection = psycopg2.connect(
                # host=self.host,
                # port=self.port,
                # database=self.database,
                # user=self.user,
                # password=self.password,
                # connect_timeout=3,
                # options='-c statement_timeout=3000'
                self.conn_str
            )
            return connection
        except Exception as e:
            logging.error(f"Error while connecting to database: {e}")
            return None

    def get_conn(self):
        return self.conn_to_db()

    def fetch_records(self,qurery):
        # Connect to database using connection pooling with pgbouncer
        records =[]
        try :
            connection =  self.conn_to_db()
            if not connection:
                raise
            logging.info("Connection Established")
            logging.info("Fetching records")        
            # Fetch records from database
            try:
                with connection.cursor() as  cursor:
                    cursor.execute(qurery)
                    records = cursor.fetchall()
                logging.info(f"Number of records featched : {len(records)}")
                return records
            except Exception as e:
                logging.error(f"Error while fetching records from database: {e}")
                raise
        except Exception as ex:
            return records
        finally :
            if connection:
                connection.close()
                logging.info("db connection closed")

    # Update records 
    def update_records(self,query,doc_id):
        try:
            # print("Doc Id:",doc_id)
            connection = self.conn_to_db()
            # Process the records
            # for record in records:
            # Update the record here
            print("query :",query)
            try:
                with connection.cursor() as cursor:
                    cursor.execute(query)
                    connection.commit()
                    logging.info(f"Updated record : {doc_id}")
            except Exception as e:
                print("query block",e)
                logging.error(f"Error while updating processed status of record with id {doc_id}: {e}")
                pass
        except:
            logging.info("Failed! While updatnig records")
        finally:
            if connection:
                connection.close()
                logging.info("db connection closed")
    
    def upload_files_to_S3(self,documentId:str,fileName:str,fileLocation:str):
        uploaded_files = {"copied_files_s3":0,"copied_data_s3":0}
        try:
            rootFolderPath = cfg.getRootFolderPath()
            #fileName = os.path.basename(fileLocation)
            #Using fileLocation download the file using putil.downloadFilesFromBlob
            blob_downloads = [ocr_pred_container +"/"+ fileLocation]
            # Define local download path and file name
            local_downloads = [rootFolderPath+"/"+fileName]
            print("download folders: ", blob_downloads, local_downloads)
            downloadUrls = zip(blob_downloads,local_downloads)
            FileDownloadStatus = putil.downloadFilesFromBlob(downloadUrls)
            docResult = downloadDocResult(fileName,documentId,rootFolderPath)
            print("invoice dwomload :",FileDownloadStatus,
                "\nDocument result dwonload :",docResult)
            # Local pdf & json paths
            pdf_path = os.path.join(rootFolderPath,fileName)
            json_path = os.path.join(rootFolderPath,os.path.splitext(fileName)[0] +'.json')
            if (FileDownloadStatus is True): 
                try:
                    print("Uploading file to S3 :",fileLocation)
                    upd_status = putil.upload_file_to_s3(file_name = pdf_path,
                                                        object_name= fileLocation)
                    print("S3 Upload File Status :",upd_status)
                    if upd_status:
                        uploaded_files["copied_files_s3"] = 1
                except Exception as e:
                    print("Upload file to s3 exception :",fileLocation,e)
                    logging.info(f"Upload file to s3 exception :"+fileLocation+ str(e))
                    uploaded_files["copied_files_s3"] = -1
                    pass
                #Delete the files in local folders
            if (docResult is True):
                try:
                    print("Uploading data to S3 :",json_path)
                    upd_path = str(os.path.splitext(str(fileLocation))[0]) + ".json"
                    upd_data_status = putil.upload_file_to_s3(file_name = json_path,
                                                              object_name = upd_path)
                    print("S3 Upload Data Status :",upd_data_status,upd_path)
                    if upd_data_status:
                        uploaded_files["copied_data_s3"] = 1

                except Exception as e:
                    print("Upload data to s3 data exception :",documentId,e)
                    logging.info(f"Upload data to s3 exception :"+str(documentId)+ str(e))
                    uploaded_files["copied_data_s3"] = -1
                    pass

                print("S3 Upload Done!")
            return uploaded_files
        except:
            print("purgeLocalDocuments",
                traceback.print_exc())
            return uploaded_files
        finally:
            for file in [pdf_path,json_path]:
                try:
                    os.remove(os.path.join(file))
                except:
                    pass
def remove_char(text:str='')->str:
    spacial = ["{","}","'",")","(",'""',"[","]",]
    for ch in spacial:
        text = str(text).replace(ch,'')
    return text

# purging records
def purge_records(cnn_str):
    logging.info(f"Data purging Started")
    get_purge_rcds = f"SELECT documentid,blobname,consumed,manual FROM {PURGE_TABLE} ORDER BY consumed_timestamp ASC"
    purge = PurgeData(cnn_str)
    records = purge.fetch_records(get_purge_rcds)
    print("No of records :",len(records))
    docs = []
    blobs = []
    purged_status =[]
    purged_msg =[]
    for doc in records:
        doc_id = doc[0]
        blob_path = doc[1]
        consumed = doc[2]
        manual = doc[3]
        print("Purging record :",doc)
        flag = 0
        msg = ""
        mg_status = purgeMongoDBRecords(doc_id)
        # print("mg_status :",mg_status)
        msg = "Purging MongoDB records : status_code: " + str(mg_status.get("status_code")) +" message: "+ str(mg_status.get("message"))
        if mg_status.get("status_code") in [200]:
            # if mongo record deleted setting purge flag to 1
            flag = 1
            blob_files = delet_blobs(connect_str,doc_id,blobname=blob_path)
            if len(blob_files) == 0:
                msg = msg + ", Purged Blob Storage files : "+str("Files Not found/ Already Deleted")
            else :
                blob_files = [":".join(x) for x in blob_files]
                blob_files = ', '.join(blob_files)
                msg = msg + ", Purged Blob Storage files : "+str(blob_files)
            vm_files = getPurgeFiles(doc_id,blob_path)
            print("vm_files :",vm_files)
            if len(blob_files) == 0:
                msg = msg + ", Purged VM files : "+str("Files Not found/ Already Deleted")
            else :
                msg = msg + ", Purged VM files : "+ str(purgeVmFiles(vm_files))
            # Update DB stutus
            upd_purge_status =f"UPDATE PUBLIC.{DB_NAME} SET purged={flag},purged_timestamp ='{datetime.datetime.now()}',purged_log='{remove_char(str(msg))}' WHERE documentid ='{doc_id}';"
            purge.update_records(upd_purge_status,doc_id)
        else:
            msg = mg_status.get("message")
            if (manual ==1):
                flag = 1
            # Update db status
            upd_purge_status =f"UPDATE PUBLIC.{DB_NAME} SET purged={flag},purged_timestamp ='{datetime.datetime.now()}',purged_log='{remove_char(str(msg))}' WHERE documentid ='{doc_id}';"
            purge.update_records(upd_purge_status,doc_id)
        # print("Updated log msg :",msg)
        docs.append(doc_id)
        blobs.append(blob_path)
        purged_status.append(flag)
        purged_msg.append(msg)
    df = pd.DataFrame()
    df["documentid"] = docs
    df["blobName"] = blobs
    df["purged_status"] = purged_status
    df["purged_msg"] = purged_msg
    purge_result = "./files/"+str(time.time()) + "purged_docs.csv"
    df.to_csv(purge_result)
    logging.info(f"Data purging Done")
    if os.path.isfile(purge_result):
        try:
            send_email(subject="Purging Report",files=[purge_result])
        except:
            print("Sending email failed")
            logging.info(f"Sending email failed :"+str(traceback.print_exc()))


def upd_data_to_s3(cnn_str):
    logging.info(f"Upload file to S3 started")
    get_S3_upd_rcds =f"SELECT documentid,filename,blobname,consumed,manual FROM PUBLIC.{S3_UPLOAD_TABLE} LIMIT 3000"

    upload_s3 = PurgeData(cnn_str)
    records = upload_s3.fetch_records(get_S3_upd_rcds)
    print("No of records :",len(records))
    docs = []
    blobs = []
    files_s3 =[]
    data_s3 =[]
    for doc in records:
        print("Uploadding record :",doc)
        doc_id = doc[0]
        fileName = doc[1]
        blob = doc[2]
        manual = doc[4]
        flags = upload_s3.upload_files_to_S3(documentId=doc_id,fileName=fileName,fileLocation=blob)
        copied_files_s3= flags.get("copied_files_s3",0)
        copied_data_s3 = flags.get("copied_data_s3",0)
        if manual == 1:
            if (copied_files_s3 in [0,-1]):
                copied_files_s3 = -1
            if (copied_data_s3 in [0,-1]):
                copied_data_s3 = -1
        upd_S3_status = f"UPDATE PUBLIC.{DB_NAME} SET copied_files_s3 ={copied_files_s3}, copied_data_s3={copied_data_s3} WHERE documentid='{doc_id}'"
        upload_s3.update_records(upd_S3_status,doc_id)
        docs.append(doc_id)
        files_s3.append(copied_files_s3)
        data_s3.append(copied_data_s3)
        blobs.append(blob)
    df = pd.DataFrame()
    df["documentid"] = docs
    df["blobName"] = blobs
    df["copied_files_s3"] = files_s3
    df["copied_data_s3"] = data_s3
    S3_upload_result = "./files/"+str(time.time()) + "s3upload.csv"
    df.to_csv(S3_upload_result)
    logging.info(f"Upload file to S3 completed")
    if os.path.isfile(S3_upload_result):
        try:
            send_email(subject="Upload Files To S3 Report" ,files=[S3_upload_result])
        except:
            print("Sending email failed")
            logging.info(f"Sending email failed :"+str(traceback.print_exc()))

import smtplib
from email import encoders
import os
from email.message import EmailMessage
import traceback
key = "cGFybWVzaHdhci5iaGFud2FsZUB0YW9hdXRvbWF0aW9uLmNvbQ=="
val = "X19QYXJtZXNoQFRBTw=="
def send_email(eFrom:str=None,
               eTo:str=None,
               subject:str=None,
               files:list=[]
              )-> str or None:
    message = EmailMessage()
    message['Subject'] = subject if subject else "Purged or S3 uploaded files"
    message['From'] = eFrom  if eFrom else 'parmeshwar.bhanwale@taoautomation.com'
    message['Reply-to'] = eFrom  if eFrom else 'parmeshwar.bhanwale@taoautomation.com'
    message['To'] = ['parmeshwar.bhanwale@taoautomation.com',"swaroop.samavedam@taoautomation.com",
                         "hariharamoorthy.theriappan@taoautomation.com","shivani.patidar@taoautomation.com"]
    message.set_content('PFA for the purging/S3 upload reccords. Thank You!') 
    for file in files: 
        with open(file,'rb') as fileObj:
            file_data = fileObj.read()
            #print("file_name :",file)
            #message.add_attachment(file_data,filename = file)
            message.add_attachment(file_data,maintype="text/csv",subtype='csv',filename = file)
            print("attached file to mmsg :",file)
            
    try:
        with smtplib.SMTP('smtp-mail.outlook.com', 587) as server:
            server.ehlo()
            server.starttls()
            server.login(putil.base64_decode(key),putil.base64_decode(val) )
            server.sendmail(message['From'], message['To'], str(message.as_string()))
            return True

    except :
        print("first exception",traceback.print_exc())
        try:
            with smtplib.SMTP_SSL('smtp-mail.outlook.com', 465) as server:
                server.ehlo()
                server.starttls()
                server.login(putil.base64_decode(key),putil.base64_decode(val) )
                server.sendmail(message['From'], message['To'], message.as_string())
                return True
        except:
            print("Send email Falied ",traceback.print_exc())
            return False
    return

if __name__ == "__main__":
    logging.basicConfig(filename=f'./files/{str(datetime.date.today())}_S3_upload_and_purging.log', level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')
    cnn_str = "host=127.0.0.1 port=6432 user=swginsta_admin@swginstapaiges dbname=swginsta_pAIges"

    # Purging data
    purge_records(cnn_str)
    # uploading files to s3 bucket
    upd_data_to_s3(cnn_str)

