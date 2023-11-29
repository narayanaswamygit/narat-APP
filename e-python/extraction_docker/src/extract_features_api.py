# -*- coding: utf-8 -*-
# In[1]: All Imports
import traceback
import os
import time
import json
import sys
import warnings
import shutil
from datetime import datetime
warnings.filterwarnings("ignore")

import util as util
import config as config

import feature_engineering_new as ft
# In[1]: Variable declaration

#Get all the folders, paths to store files

outputFolder = config.getBlobOPFolder()
tempFolderPath = config.getTempFolderPath()
subContainerPath = "submasterstorage"

# In[Log Close and Open]

def logClose(logfile):
    try:
        if not logfile.closed:
            logfile.close()
    except Exception as e:
        print("Logging Issue: \n",traceback.print_exc(), e)
        pass
    
def logAppend(logfilepath):
    try:
        logfile = open(logfilepath,"a")
        sys.stdout = logfile
        sys.stderr = logfile
        return logfile
    except Exception as e:
        print("Logging Issue : \n",traceback.print_exc(), e)
        pass


# In[1]: Define Response for Success and Failure
def uploadStatusToBlob(client_blob_folder,
                        auth_token,
                        documentId,
                        sub_id, 
                        body, 
                        stage,
                        success,
                        start, 
                        end,
                        pageNumber = None):
    def updateStatus():
        stats = {}
        stats['auth_token'] = auth_token
        stats['document_id'] = documentId
        stats['sub_id'] = sub_id
        stats['body'] = body
        stats['stage'] = stage
        stats['success'] = success
        stats['create_time'] = str(datetime.now())
        stats['is_start'] = start
        stats['is_end'] = end 
        response = json.dumps(stats,
                              indent = 4,
                              sort_keys = False,
                              default = str)
        return response
    try:
        file_contents = updateStatus()
        file_name = str(auth_token) + "__" + str(stage) +'.json'
        if pageNumber is not None:
            file_name = str(auth_token) + "__pageNo_" + str(pageNumber) + "_" + str(stage) +'.json'
        file_path = os.path.join(client_blob_folder, file_name)
        os.makedirs(client_blob_folder,
                    exist_ok=True)
        with open(file_path,"w") as f:
            f.write(file_contents)
    
        uploaded, URI = util.uploadFilesToBlobStore(sub_id, file_path)
        if uploaded:
            try:
                os.remove(file_path)
            except:
                print("uploadStatusToBlob",
                      traceback.print_exc())
                return False

        return uploaded
    except:
        print(uploadStatusToBlob,
              traceback.print_exc())
        return False

def returnFailure(client_blob_folder, 
                  auth_token,
                  sub_id,
                  documentId, 
                  stage):     
    """
    

    Parameters
    ----------
    accountName : TYPE
        DESCRIPTION.
    client_blob_folder : TYPE
        DESCRIPTION.
    accessKey : TYPE
        DESCRIPTION.
    auth_token : TYPE
        DESCRIPTION.
    sub_id : TYPE
        DESCRIPTION.
    documentId : TYPE
        DESCRIPTION.
    stage : TYPE
        DESCRIPTION.

    Returns
    -------
    TYPE
        DESCRIPTION.

    """
    
    def getFailedStatus():
        
        def failedStatus(auth_token, sub_id):
            stats = {}
            stats['auth_token'] = auth_token
            stats['document_id'] = documentId
            stats['sub_id'] = sub_id
            stats['body'] = json.dumps({})
            stats['stage'] = "extraction"
            stats['success'] = 0
            stats['create_time'] = str(datetime.now())
            stats['is_start'] = 0
            stats['is_end'] = 1
            response = json.dumps(stats,
                                  indent = 4,
                                  sort_keys = False,
                                  default = str)
            return response
        print("Failed Auh token {} for Sub ID {}".format(auth_token, sub_id))
        file_contents = failedStatus(auth_token, sub_id)
        print("Failed ", file_contents)
        file_name = str(auth_token)+"__failed.json"
        file_path = os.path.join(client_blob_folder, file_name)
        print("Failed File: ", file_path)
        with open(file_path,"w") as f:
            f.write(file_contents)
                
        uploaded, URI = util.uploadFilesToBlobStore(sub_id, file_path)
        print("Failed status updated: {}, at {}".format(uploaded, URI))
        if uploaded:
            try:
                os.remove(file_path)
            except Exception:
                print(traceback.print_exc())

        return uploaded
    failed = getFailedStatus()
    if failed:
        resp_code = 404
    else:
        resp_code = 200
    docInfo = {}
    docInfo['status'] = "Failure"
    docInfo['responseCode'] = resp_code
    response = json.dumps(docInfo,
                          indent = 4,
                          sort_keys = False,
                          default = str)
    return response


# In[2]: Landing Function
# @util.timing
def extract_features_Api(docInput):

    #PreProcess steps from selecting a file for pre-processing,
    #1. An image is split into multiple files in the synchronous preproc method.
    #These files will be processed in a sequence
    #2. Each page goes through 3 steps. 1. Image Enhancement (blurring, sharpening, etc.,)
    # and 2. Deskew Image and 3. Cropping of image to a scale
    #3. These preprocessed images are then sent to a model for extracting invoice details
    #4. Convert each page to a .png file to be displayed in the website

    # Logging
    print("Before parsing input json")
    rawContent = docInput.content.read()
    encodedContent = rawContent.decode("utf-8")
    stats = json.loads(encodedContent)
    print("Printing docInfo content: ", stats)
    topic = stats['topic']
    subject = stats['subject']

    # Get storage account details 
    storage_account, container_name, blob_path, file_name = util.parse_blob_triggers(topic,
                                                                                     subject)
    sub_id = container_name

    fileURI = os.path.basename(subject)
    print("Testing input: ",
          sub_id,
          file_name,
          fileURI)
    # Download content of HTTP request 
    content, received = util.downloadStreamFromBlob(sub_id,
                                                    fileURI)

    # Get auth_token, sub_id from content
    print("Printing input JSON")
    print(content)
    auth_token = content["auth_token"]
    sub_id = content["sub_id"]
    ocr_result = json.loads(content['body'])
    # content_body = content_body.get("request")
    documentId = ocr_result["documentId"]
    totalNoPages = ocr_result["totalNoPages"]
    pageNumber = ocr_result["pageNumber"]
    pages = ocr_result["pages"]

    if "client_blob_folder" in stats.keys():
        client_blob_folder = content["client_blob_folder"]
    else:
        client_blob_folder = "COMMON"

    print("Before logging")
    std_out = sys.stdout
    std_err = sys.stderr
    logfilepath = str(documentId) + "_page_" + str(pageNumber) + "_feature.log"
    logfile = open(logfilepath,"w")
    sys.stdout = logfile
    sys.stderr = logfile

    try:

        os.makedirs(tempFolderPath,
                    exist_ok=True)
        os.makedirs(client_blob_folder,
                    exist_ok=True)

        print("Before calling OCR function: ")
        t = time.time()
        #Trigger OCR
        ocr_pages = ocr_result.get("ocr_pages")
        print("OCR successful")

        ftr_eng_input = {"documentId":documentId,
                         "client_folder":client_blob_folder,
                         "container":sub_id}
        ftr_eng_input["page_details"] = [{"image_path": ocr_page.get("image_path"),
                                        "ocr_path":ocr_page.get("ocr_path"),
                                        "document_page_number":ocr_page.get("document_page_number")
                                        } for ocr_page in ocr_pages]
        print("Passing OCR output to feature engineering :",
              ftr_eng_input)
        t = time.time()

        ftr_result = ft.extract_features(ftr_eng_input,
                                         pageNumber)
        print("TIME taken to process features for a single page",
              time.time() - t,pageNumber)
        ftr_result = json.loads(ftr_result)
        if ftr_result["status_code"] != 200:
            return returnFailure(client_blob_folder,
                                 auth_token,
                                 sub_id,
                                 documentId,
                                 "failed")

        #Upload feature file to a blob folder to trigger model prediction
        ftr_result["client_blob_folder"] = client_blob_folder
        ftr_result["container"] = sub_id
        ftr_result["pages"] = pages
        try:
            ftr_result["no_pages_ocred"] = len(ocr_pages)
        except:
            pass
        updated = uploadStatusToBlob(client_blob_folder,
                                     auth_token,
                                     documentId,
                                     sub_id,
                                     json.dumps(ftr_result),
                                     "feature_engg",
                                     1,
                                     0,
                                     0,
                                     pageNumber)
        if not updated:
            return returnFailure(client_blob_folder, 
                                 auth_token,
                                 sub_id,
                                 documentId,
                                 "failed")

        docInfo = {}
        docInfo['status'] = 'Success'
        docInfo['ftrs'] = ftr_result
        docInfo["responseCode"] = 200
        #Return OCRed pages - Aug 05 2022
        try:
            docInfo["no_pages_ocred"] = len(ocr_pages)
        except:
            pass
        #Return OCRed pages - Aug 05 2022

        #8. return metadata at all levels, page URls, etc.,
        response = json.dumps(docInfo,
                              indent = 4,
                              sort_keys = False,
                              default = str)
        #Copy the files to a folder where pre-processing and ABBYY processsing will be triggered
        #Get PreProc Folder from a config file
        return response

    except:
        print("Extraction API:",traceback.print_exc())
        return returnFailure(client_blob_folder, 
                             auth_token,
                             sub_id,
                             documentId,
                             "failed")

    finally:
        if not logfile.closed:
            logfile.close()
            sys.stdout = std_out
            sys.stderr = std_err
            # destination = client_blob_folder + "/" + os.path.basename(logfilepath)
            uploaded, URI = util.uploadFilesToBlobStore(sub_id,
                                                        logfilepath)
            try:
                os.remove(logfilepath)
                shutil.rmtree(tempFolderPath)
                shutil.rmtree(client_blob_folder)
            except:
                pass
            if uploaded:
                print("extraction log file uploaded to Blob")

