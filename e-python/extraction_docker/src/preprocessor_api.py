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

import imgPreProc as imgproc

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
                    exist_ok = True)
        with open(file_path,"w") as f:
            f.write(file_contents)

        uploaded, URI = util.uploadFilesToBlobStore(sub_id, file_path)
        if uploaded:
            try:
                os.remove(file_path)
            except:
                print("uploadStatsToBlob",
                      traceback.print_exc())
                return False

        return uploaded
    except:
        print("uploadStatusToBlob",
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
def preprocessApi(docInput):

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
    content_body = json.loads(content['body'])
    # content_body = content_body.get("request")
    documentId = content_body["documentId"]
    totalNoPages = content_body["totalNoPages"]
    pageNumber = content_body["pageNumber"]

    if "client_blob_folder" in stats.keys():
        client_blob_folder = content["client_blob_folder"]
    else:
        client_blob_folder = "COMMON"

    print("Before logging")
    std_out = sys.stdout
    std_err = sys.stderr
    logfilepath = str(documentId) + "_page_" + str(pageNumber) + "_preprocess.log"
    logfile = open(logfilepath,"w")
    sys.stdout = logfile
    sys.stderr = logfile

    try:

        os.makedirs(tempFolderPath,
                    exist_ok = True)
        os.makedirs(client_blob_folder,
                    exist_ok = True)

        print("Inside extraction API call")
        splitPageFiles = content_body.get('pages')
        orgFileLocation = content_body.get('orgFileLocation')        
        extn = content_body.get('extn')
        print("Document Id:",
              documentId,
              "File Locations",
              str(splitPageFiles),
              content_body)

        docInfo = {}
        docInfo["documentId"] = documentId
        docInfo["pages"] = None
        docInfo["invoiceNumber"] = None
        docInfo["invoiceDate"] = None
        docInfo["totalAmount"] = None
        docInfo["currency"] = None

        #Download the tiff files coming from API call
        if len(splitPageFiles) == 0:
            return None

        print("Split files retrieved")

        #1. Apply Image enhancement procedures
        #2. Rotate the image
        #3. Crop the Image
        #4. ML Extraction

        pageDetails = []
        pageInfoForModel = {}
        results = []
        print("page processing started",splitPageFiles)

        data = {"pages":splitPageFiles,
                "documentId":documentId,
                "totalNoOfPages":totalNoPages,
                "pageNumber":pageNumber,
                "client_folder":client_blob_folder,
                "container": sub_id,
                "orgFileLocation":orgFileLocation,
                "extn":extn}

        print("Input for img preprocess function :", data)
        t = time.time()
        results = imgproc.preprocessPages(data)
        if results is None:
            return returnFailure(client_blob_folder,
                                 auth_token,
                                 sub_id,
                                 documentId,
                                 "failed")
        print("TIME TAKEN FOR IMAGE PREPROCESSING FUNCTION: ",
              time.time() - t)
        print("Image Preprocessed results: ",
              results)

        # Result returns a list of dictionaries for every page containing IMAGE URIs

        assert(len(splitPageFiles) == len(results))
        print("page processing completed")
        
        if len(results) == 0:
            return None

        for i, result in enumerate(results):
            pageInfo = result
            # Note: NSK if extenttion is not pdf pageBlobPath will be image else PDF
            # extn = result.get('extn')
            # if extn != '.pdf':
            pageBlobPath = result["image"]
            # else:
                # pageBlobPath = result['pdf']

            pageInfo = {}
            pageInfo["index"] = result["pageNo"]
            pageInfo["url"] = result["pngURI"]
            pageInfo["preproc-image"] = pageBlobPath
            pageDetails.append(pageInfo)

            key = documentId + "-" + result["pageNo"]
            if pageBlobPath is None:
                return None
            if pageBlobPath == "":
                return None

            #Input to Model
            pageSubInfo = {}
            pageSubInfo["image_path"] = pageBlobPath
            pageSubInfo["png_path"] = result["pngURI"]
            # pageSubInfo["pdf_path"] = result["pdfURI"]
            # pageSubInfo["extn"] = result.get("extn")
            pageSubInfo["document_page_number"] = result["pageNo"]
            pageSubInfo["page_height"] = result["height"] * 1.0
            pageSubInfo["page_width"] = result["width"] * 1.0

            pageInfoForModel[key] = pageSubInfo

        docInfo["pages"] = pageDetails

        #Call AI model
        pageDetailsOcr = {"documentId":documentId,
                          "totalNoPages":totalNoPages,
                          "pageNumber":pageNumber,
                          "page_details":pageInfoForModel,
                          "orgFileLocation": orgFileLocation,
                          "extn": extn,
                          "logfilepath":logfilepath,
                          "client_folder":client_blob_folder,
                          "container":sub_id}
        print("Before calling OCR function: ", pageDetailsOcr)
        t = time.time()
        #Save the file to trigger OCR
        updated = uploadStatusToBlob(client_blob_folder,
                                     auth_token,
                                     documentId,
                                     sub_id,
                                     json.dumps(pageDetailsOcr),
                                     "ocr_start",
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

        return None

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

