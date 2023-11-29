# -*- coding: utf-8 -*-

import requests
import json
from sys import argv
import config as cfg
import sys
import os

import pytz
import pandas as pd
import time
import datetime

from dateutil import tz


tz_ist = pytz.timezone('Asia/Kolkata')
tz_NY = pytz.timezone('America/New_York')

statusRevComp = cfg.getStatusReviewCompleted()
statusProcessed = cfg.getStatusProcessed()
statusReview = cfg.getStatusReview()
statusFailed = cfg.getStatusFailed()
statusNew = "NEW"
statusDeleted = "DELETED"


UI_SERVER = cfg.getUIServer()
# UI_SERVER = "http://20.207.203.221"
UI_SERVER = "http://52.172.153.247:7777"
# UI_SERVER = "https://www.scootsypaiges.com"

GET_DOCUMENT_RESULT = cfg.getDocoumentResult()
FIND_DOCUMENT = cfg.getDocumentFind()


fieldMapping = {}
with open(r"fieldMapping.json","r") as f:
    fieldMapping = json.load(f)

list_fields = list(fieldMapping.keys())


def initiate_payload_find(fetch_date):
    """
    """
    start_time = datetime.datetime(fetch_date.year, fetch_date.month, fetch_date.day)
    print("Start time:", start_time)
    end_time = start_time + datetime.timedelta(days=1)
    print("End Time:", end_time)

    tt = time.mktime(start_time.timetuple())
    start_time_epoch = datetime.datetime.fromtimestamp(tt).timestamp()*1000

    tt = time.mktime(end_time.timetuple())
    end_time_epoch = datetime.datetime.fromtimestamp(tt).timestamp()*1000

    print(start_time_epoch, end_time_epoch)
    
    payload = {
                "ver": "1.0",
                "params": {"msgid": ""},
                "request": {
                    "filter": {
                        "submittedOn": {
                            ">=": start_time_epoch,
                            "<=": end_time_epoch
                        }
                    },
                "limit": 999999
                }
            }
    return payload


def find_false_positives(headerItems, l_corrections):
    """
    Check if updated value equals any of the other fields in extracted value.
    if yes we have a false positive. FP’ =Y
    """
    l_fp = []
    # print("Corrections:", l_corrections)
    # print(headerItems)
    # For each extracted field, save fieldValue and correctdValue in the dictionary with fieldId as the key
    dict_values = {}
    for l in headerItems:
        temp_dict = {}
        if "fieldValue" in l:
            temp_dict["fieldValue"] = l["fieldValue"]
        if "correctedValue" in l:
            temp_dict["correctedValue"] = l["correctedValue"]
        dict_values[l["fieldId"]] = temp_dict

    # print(dict_values)

    # Check whether for the corrections, the correctedValue is equal to fieldValue for any other field
    for c in l_corrections:
        if c in dict_values:
            if "fieldValue" in dict_values[c]:
                extracted_value = dict_values[c]["fieldValue"]
                for key, value in dict_values.items():
                    if (key != c) & (str(value["fieldValue"]).strip() == str(extracted_value).strip()):
                        # False Positive found
                        # print(key + "extracted as" + c)
                        if str(extracted_value).strip() != "0":
                            l_fp.append(c)

    # print(l_fp)
    return l_fp


def convert_epoch_ist(epoch_time):
    """
    """
    epoch_time = str(epoch_time)
    if len(epoch_time) > 10:
        epoch_time = float(epoch_time)/1000

    epoch_time = float(epoch_time)
    time_ist = datetime.datetime.fromtimestamp(epoch_time, tz_ist).strftime("%d/%m/%Y %H:%M:%S")

    return time_ist


def fetch_corrections(fetch_date):
    """
    """
    find_url = UI_SERVER + FIND_DOCUMENT
    doc_result_get_url = UI_SERVER + GET_DOCUMENT_RESULT

    headers = {}    
    headers["Content-Type"] = "application/json"

    payload = initiate_payload_find(fetch_date)
    data = json.dumps(payload)

    print("Calling Find API:",find_url)
    print("Payload:", data)

    response =  requests.post(find_url, headers=headers, data = data)
    response = response.json()

    list_df = []

    if response["responseCode"] == "OK":
        # print("Response Success")
        results = response["result"]
        total_res_count = results["count"]
        documents = results["documents"]
        print("TOTAL DOCUMENT COUNT:", total_res_count)

        for doc in documents:
            # doc_id = doc
            # status = statusRevComp
            print(doc)
            file_name = doc["fileName"]
            doc_id = doc["documentId"]
            status = doc["status"]
            
            dict_row = {}
            dict_row["File Name"] = file_name
            dict_row["Document ID"] = doc_id
            dict_row["Status"] = status
            dict_row["Submitted On"] = ""
            dict_row["VENDOR NAME"] = ""
            dict_row["VENDOR GSTIN"] = ""
            dict_row["Billing GSTIN"] = ""
            dict_row["Shipping GSTIN"] = ""
            dict_row["User"] = ""
            dict_row["Error Message"] = ""
            dict_row["STP System"] = ""
            dict_row["User Comment"] = ""
            dict_row["Total Review Time"] = ""
            dict_row["Review Completion/Deletion Time"] = ""
            dict_row["Delete Reason"] = ""

            dict_row["Incorrect FP"] = 0


            if "comment" in doc:
                dict_row["User Comment"] = doc["comment"]

            if "submittedOn" in doc:
                dict_row["Submitted On"] = convert_epoch_ist(doc["submittedOn"])

            if "stp" in doc:
                dict_row["STP System"] = str(doc["stp"])                

            # Get document Results
            url = UI_SERVER + GET_DOCUMENT_RESULT + str(doc_id)
            print("Fetching doc result for:", url)
            resp = requests.get(url, headers= headers)

            resp = resp.json()

            if resp["responseCode"] == "OK":
                if status == statusRevComp:
                    headerItems = resp["result"]["document"]["documentInfo"]
                    # dict_row = dict.fromkeys(list_fields, "")
                    dict_row["Total Review Time"] = ""
                    if "reviewedBy" in doc:
                        dict_row["User"] = doc["reviewedBy"]

                    if "totalReviewedTime" in doc:
                        dict_row["Total Review Time"] = doc["totalReviewedTime"]/60

                    if "reviewedAt" in doc:
                        dict_row["Review Completion/Deletion Time"] = convert_epoch_ist(doc["reviewedAt"])

                    dict_row = {**dict_row, **dict.fromkeys(list_fields, "")}
                    # print(headerItems)
                    # Call method to extract False Positives
                    l_corrections = []
                    # print(headerItems)
                    for l in headerItems:
                        # Code to add vendorName
                        if l["fieldId"] == "vendorName":
                            if "correctedValue" in l:
                                dict_row["VENDOR NAME"] = l["correctedValue"]
                            else:
                                dict_row["VENDOR NAME"] = l["fieldValue"]
                        if l["fieldId"] == "vendorGSTIN":
                            if "correctedValue" in l:
                                dict_row["VENDOR GSTIN"] = l["correctedValue"]
                            else:
                                dict_row["VENDOR GSTIN"] = l["fieldValue"]
                        if l["fieldId"] == "billingGSTIN":
                            if "correctedValue" in l:
                                dict_row["Billing GSTIN"] = l["correctedValue"]
                            else:
                                dict_row["Billing GSTIN"] = l["fieldValue"]
                        if l["fieldId"] == "shippingGSTIN":
                            if "correctedValue" in l:
                                dict_row["Shipping GSTIN"] = l["correctedValue"]
                            else:
                                dict_row["Shipping GSTIN"] = l["fieldValue"]
                        if "correctedValue" in l:
                            if (float(l["confidence"]) == 0) & (str(l["correctedValue"]).strip() != ""):
                                # Inside No Extraction Case: M
                                # print("Inside No Extraction Case")
                                dict_row[l["fieldId"]] = "Missed"
                            elif (str(l["fieldValue"]).strip() != "") & (str(l["correctedValue"]).strip() != ""):
                                # Inside Wrong Extraction Case: X
                                # print("Inside Wrong Extraction Case")
                                dict_row[l["fieldId"]] = "Incorrect"
                                l_corrections.append(l["fieldId"])
                        else:
                            # Inside No Correction Case: OK
                            # Inside Field not present Case: ""
                            if ("AMOUNT" in str(l["fieldId"]).upper()) | ("TOTAL" in str(l["fieldId"]).upper()):
                                if (float(str(l["fieldValue"]).strip()) == 0) & (float(l["confidence"]) == 0):
                                    dict_row[l["fieldId"]] = ""
                                else:
                                    dict_row[l["fieldId"]] = "OK"
                            else:
                                dict_row[l["fieldId"]] = "OK"

                    # l_corrections.append("CGSTAmount")
                    l_fp = list(set(find_false_positives(headerItems, l_corrections)))
                    dict_row["False Positives"] = l_fp
                    dict_row["Incorrect FP"] = len(l_fp)
                elif status == statusDeleted:
                    if "deleteReason" in doc:
                        dict_row["Delete Reason"] = doc["deleteReason"]
                    if "deletedBy" in doc:
                        dict_row["User"] = doc["deletedBy"]
                    if "deleteTime" in doc:
                        dict_row["Review Completion/Deletion Time"] = convert_epoch_ist(doc["deleteTime"])
                elif status == statusReview:
                    headerItems = resp["result"]["document"]["documentInfo"]
                    for l in headerItems:
                        # Code to add vendorName
                        if l["fieldId"] == "vendorName":
                            if "correctedValue" in l:
                                dict_row["VENDOR NAME"] = l["correctedValue"]
                            else:
                                dict_row["VENDOR NAME"] = l["fieldValue"]
                        if l["fieldId"] == "vendorGSTIN":
                            if "correctedValue" in l:
                                dict_row["VENDOR GSTIN"] = l["correctedValue"]
                            else:
                                dict_row["VENDOR GSTIN"] = l["fieldValue"]
                        if l["fieldId"] == "billingGSTIN":
                            if "correctedValue" in l:
                                dict_row["Billing GSTIN"] = l["correctedValue"]
                            else:
                                dict_row["Billing GSTIN"] = l["fieldValue"]
                        if l["fieldId"] == "shippingGSTIN":
                            if "correctedValue" in l:
                                dict_row["Shipping GSTIN"] = l["correctedValue"]
                            else:
                                dict_row["Shipping GSTIN"] = l["fieldValue"]
            else:
                dict_row["Error Message"] = "Error in fetching Document Results"
            list_df.append(dict_row)
    else:
        print("Error in find API!!!")

    DF = pd.DataFrame(list_df)
    return DF


def calculate_accuracy(DF):
    """
    """
    DF["Correct Extraction"] = (DF == 'OK').T.sum()
    DF["Not Extracted"] = (DF == 'Missed').T.sum()
    DF["Incorrect Extraction"] = (DF == 'Incorrect').T.sum()
    DF["Not Present"] = len(list_fields) - (DF["Correct Extraction"] + DF["Not Extracted"] + DF["Incorrect Extraction"])

    DF["Accuracy SWIGGY"] = ((DF["Correct Extraction"] + DF["Not Present"])/len(list_fields))*100
    DF["Accuracy PAIGES"] = (DF["Correct Extraction"]/(len(list_fields) - DF["Not Present"]))*100
    DF["Probable STP"] = 0
    DF.loc[(DF["Accuracy SWIGGY"] == 100), "Probable STP"] = 1

    DF["Incorrect Extraction"] = DF["Incorrect Extraction"] - DF["Incorrect FP"]
    DF.loc[(DF["Status"] != statusRevComp), 
    ["Correct Extraction", "Not Extracted", "Incorrect Extraction", "Not Present", "Accuracy SWIGGY",
    "Accuracy PAIGES", "Probable STP", "Incorrect FP"]] = ""

    # Rearrange Columns
    cols_at_end = ["Correct Extraction","Not Extracted","Incorrect Extraction", "Incorrect FP", "Not Present", 
    "Accuracy SWIGGY", "Accuracy PAIGES", "Probable STP"]
    DF = DF[[c for c in DF if c not in cols_at_end] + [c for c in cols_at_end if c in DF]]

    return DF


def main(offset):
    """
    """

    today = datetime.datetime.now().date()
    print("Current Date:", today)
    fetch_date = today - datetime.timedelta(days=offset)
    print("Fetch Date:", fetch_date)

    print("Inside main method!!!!")
    DF = fetch_corrections(fetch_date)
    if DF.shape[0] > 0:
        DF = calculate_accuracy(DF)

    file_name = "Reports/Correction Report For Documents Uploaded on " + str(fetch_date) + ".csv"
    DF.to_csv(file_name, index=False)


if __name__ == "__main__":
    offset = 0
    if len(argv) > 1:
        offset = int(argv[1])
    main(offset=offset)
