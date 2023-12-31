# -*- coding: utf-8 -*-
import traceback
import os
import time
import pandas as pd
import json
from datetime import datetime, timedelta

import config as cfg

import psycopg2

# from pgConnectionPool import getConnection

from cryptography.fernet import Fernet

from azure.storage.blob import BlobServiceClient
from azure.storage.blob import generate_account_sas, ResourceTypes, AccountSasPermissions


from azure.keyvault.secrets import SecretClient
# from azure.identity import ClientSecretCredential
import base64

# In[Get current working directory]

#get script directory
script_dir = os.path.dirname(__file__)
print("Script Directory:", script_dir)

# In[Create a connection to Blob Storage]

conn_string = cfg.getSubDbConn()
encryption_key = cfg.getSubPvtEncryptKey()

# In[1]: Timer function

def timing(f):
    """
    Function decorator to get execution time of a method
    :param f:
    :return:
    """

    def wrap(*args, **kwargs):
        time1 = time.time()
        ret = f(*args, **kwargs)
        time2 = time.time()
        print('Time taken to execute {:s} is: {:.3f} sec'.format(f.__name__, (time2 - time1)))
        return ret

    return wrap

# In[Machine ID]

def __getMacAddress__():
    """
    Returns
    -------
    get_mac : st
        MAC ID.
    """
    from uuid import getnode as get_mac
    return get_mac()

# In[Subscription credentials]

# Get storage account details from database.
# Storae account details presumed to be named as subscription ID of the client

def get_blob_account_details_old(sub_id):
        """
        Parameters: sub_id
        Returns: access_key, account_name, container
        """
        try:
            with psycopg2.connect(conn_string) as conn:
                with conn.cursor() as cursor:
                    print("select access_key,account_name,container_name from storage_account WHERE sub_id='"+sub_id+"'")
                    cursor.execute("select access_key,account_name,container_name from storage_account WHERE sub_id='"+sub_id+"'")
                    DF = pd.DataFrame(cursor.fetchall(),columns = ["access_key",
                                                                   "account_name",
                                                                   "container_name"])
                    if DF.shape[0]==1:
                        return DF.iloc[0]["access_key"], DF.iloc[0]["account_name"],DF.iloc[0]["container_name"]
                    else:
                        return None,None,None
        except:
            print(traceback.print_exc())
            return None,None,None

def get_service_principal():
    
    print("Get Service Principal Begin")
    encodedString = cfg.getServicePrinciple()
    base64_string_byte = encodedString.encode("UTF-8")
    oringal_string_bytes = base64.b64decode(base64_string_byte)
    orignal_string = oringal_string_bytes.decode("UTF-8")
    sp_list = orignal_string.split(';')
    tenant_id, client_secret, client_id = sp_list[0],sp_list[1],sp_list[2]
    print("Service Principal details",
          tenant_id,client_secret,client_id)
    
    return tenant_id, client_secret, client_id


def get_blob_account_details(sub_id):
    '''
    

    Parameters
    ----------
    sub_id : TYPE
        DESCRIPTION.

    Returns
    -------
    None.

    '''
    try:
        """print("before accessing key vault")
        keyVaultName = cfg.getSecretVault()
        KVUri = f"https://{keyVaultName}.vault.azure.net"
        tenant_id, client_secret, client_id = get_service_principal()
        print("After getting service principal")
        credential = ClientSecretCredential(tenant_id = tenant_id,
                                    client_id = client_id,
                                    client_secret = client_secret)
        print("After getting credentials from secret vault",
              credential)


        client = SecretClient(vault_url=KVUri, credential=credential)
        print("After getting client",
              client)
        access_key = client.get_secret('access').value
        print("After getting access key",
              access_key)
        account_name = client.get_secret('account').value
        print("After getting accont name",
              account_name)"""
        container_name = sub_id
        """print("After getting sub id",
              container_name)"""
        from cryptography.fernet import Fernet
        # Initialize the Fernet cipher with the encryption key
        encrypted_access_key = cfg.get_blob_access_key()
        key = cfg.getKEY()
        # print("encrypted_aceess_key", encrypted_access_key, "key",key)
        cipher = Fernet(key)
        # print(cipher)
        decrypted_access_key = cipher.decrypt(encrypted_access_key.encode())
        # print("decrypted_key", decrypted_access_key)
        access_key = decrypted_access_key.decode('utf-8')
        account_name = cfg.get_account_name()

        return access_key, account_name, container_name
    except Exception as e:
        print("Exception occured", e)
        return None,None,None
    
    
    


# In[Blob access related functions]

def check_subid_DB(sub_id,mac_id):
    try:
        with psycopg2.connect(conn_string) as conn:
        # conn = getConnection()
            with conn.cursor() as cursor:
                select_sql = f"SELECT sub_id FROM allowed_machines where sub_id = '{sub_id}' and mac_id = '{mac_id}'"
                # logger.debug(select_sql)
                print("GET SAS Token",select_sql)
                cursor.execute(select_sql)
                # logger.debug("executed cursor")
                DF = pd.DataFrame(cursor.fetchall(),columns = ["sub_id"])
                # logger.debug("fetched data from cursor")
                # logger.debug("DataFrame shape is:" + str(DF.shape))
                if DF.shape[0] >= 1:
                    sub_id = DF['sub_id'].iloc[0]
                    # logger.debug("Subscriber id is:" +str(sub_id))
                    return str(sub_id)
                else:
                    return None
    except Exception as e:
        print(traceback.print_exc())
        print("subid not found in DB\n", e)
        return None

def generate_SAS_token(sub_id,
                       activity,
                       file_size = None,
                       IP = None):

    try:

        # logger.debug("generate sas token, sub id:" + sub_id)
        # access_key,account_name,container_name=get_blob_account_details(sub_id)
        print("Before getting blob account details")
        access_key,account_name,container_name = get_blob_account_details(sub_id)
        print("After getting blob account details")
        time_mins = 10
        if access_key is not None and account_name is not None:
            account_url="https://"+account_name+".blob.core.windows.net"
            print("Print blob account url", account_url)
            if activity.lower() == "upload":
                sas_token = generate_account_sas(
                    account_name=account_name,
                    account_key=access_key,
                    resource_types=ResourceTypes(object=True),
                    ip=IP,
                    permission=AccountSasPermissions(write=True),
                    expiry=datetime.utcnow() + timedelta(minutes=time_mins))
                print("SAS token", sas_token)
                # logger.debug("successfully generated token: upload")
            elif activity.lower() == "download":
                sas_token = generate_account_sas(
                    account_name=account_name,
                    account_key=access_key,
                    resource_types=ResourceTypes(object=True),
                    ip=IP,
                    permission=AccountSasPermissions(read=True),
                    expiry=datetime.utcnow() + timedelta(minutes=time_mins))
                print("SAS token", sas_token)
                # logger.debug("successfully generated token: download")
            elif activity.lower() == "delete":
                sas_token = generate_account_sas(
                    account_name=account_name,
                    account_key=access_key,
                    resource_types=ResourceTypes(object=True),
                    ip=IP,
                    permission=AccountSasPermissions(delete=True),
                    expiry=datetime.utcnow() + timedelta(minutes=time_mins))
                print("SAS token", sas_token)
                # logger.debug("successfully generated token: delete")
            else:
                sas_token = None
                account_url = None
                # logger.debug("not generated token")
            # logger.debug("Account details: " + account_url + sas_token + container_name)
            return account_url,sas_token,container_name
    except:
        print("failure while sas token generation")
        print("SAS token exception")
        return None,None,None

def gen_sas_token(sub_id,mac_id,IP,activity):
    try:
        sub_id = check_subid_DB(sub_id, mac_id)
        print(sub_id, "subid")
        if sub_id is None:
            return None,None, None
        account_url,credential,container_name=generate_SAS_token(sub_id,
                                                                 activity,
                                                                 None,
                                                                 IP=IP)
        if account_url is None:
            return None,None,None
        return account_url,credential,container_name
    except:
        print(traceback.print_exc())
        return None, None, None


# In[cryptography]

def decryptMessage(encrpyted_json):
    try:
        fernet = Fernet(encryption_key)
        enc_message=bytes(encrpyted_json,'utf-8')
        message = fernet.decrypt(enc_message).decode()
        return message
    except:
        print("Decryption fails")
        return None

def encrypt_message(input_json):
    try:
        f = Fernet(encryption_key)
        encrypted_token = f.encrypt(bytes(input_json, 'utf-8'))
        encrypted_token=encrypted_token.decode("utf-8")
        enc_message=json.dumps({"message": encrypted_token,
                                "status":200,
                                "error_message":""})
        return enc_message
    except:
        enc_message={"message":"",
                     "status":404,
                     "error_message":"issue in encryption"}
        return json.dumps(enc_message)


# In[File access from/to blob]
@timing
def uploadFilesToBlobStore(sub_id,filePath):
    """

    Parameters
    ----------
    sub_id : TYPE
        DESCRIPTION.
    filePath : TYPE
        DESCRIPTION.

    Returns
    -------
    TYPE
        DESCRIPTION.

    """    

    try:
        mac_id = __getMacAddress__()
        mac_id = '105852647403622'
        account_url,credential,container_name = gen_sas_token(sub_id,
                                                              mac_id,
                                                              None,
                                                              "upload")
        blob_service_client = BlobServiceClient(account_url=account_url,
                                                credential=credential)

        fileName = os.path.basename(filePath)
        blob_client = blob_service_client.get_blob_client(container = container_name,
                                                          blob = fileName)
        with open(filePath, "rb") as data:
            blob_client.upload_blob(data,
                                    overwrite=True)
        blobPath = container_name + "/" + fileName

        return True,blobPath
    except:
        print(traceback.print_exc())
        return False, None
@timing
def downloadFilesFromBlobStore(sub_id,
                               fileURI,
                               localPath):

    try: 
        mac_id = __getMacAddress__()
        mac_id = '105852647403622'
        account_url,credential,container_name = gen_sas_token(sub_id,
                                                              mac_id,
                                                              None,
                                                              "download")
        blob_service_client = BlobServiceClient(account_url=account_url,
                                                credential=credential)
        print("Download From Blob Store", fileURI)
        
        splitURI = fileURI.split(container_name+"/")
        print(splitURI)
        
        if len(splitURI) == 1:
            blobname = splitURI[0]
        elif len(splitURI) >1:
            blobname = splitURI[-1]
        else:
            return False
        print(blobname)
        
        blob_client = blob_service_client.get_blob_client(container=container_name,
                                                          blob=blobname)
        with open(localPath,"wb") as download_file:
            download_file.write(blob_client.download_blob().readall())

        return True
    except:
        print(traceback.print_exc())
        return False
@timing
def downloadStreamFromBlob(sub_id, fileURI):

    try:
        mac_id = __getMacAddress__()
        mac_id = '105852647403622'
        account_url,credential,container_name = gen_sas_token(sub_id,
                                                              mac_id,
                                                              None,
                                                              "download")
        blob_service_client = BlobServiceClient(account_url=account_url,
                                                credential=credential)
        print("Download From Blob Store", fileURI)
        blob_client = blob_service_client.get_blob_client(container=container_name,
                                                          blob=fileURI)
        streamdownloader = blob_client.download_blob()
        content = json.loads(streamdownloader.readall())
    
        
        return content, True
    except:
        print(traceback.print_exc())
        return {}, False

# %%
