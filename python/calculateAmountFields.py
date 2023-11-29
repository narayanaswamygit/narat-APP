#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Oct 17 14:00:34 2022

@author: Parmesh
"""
import pandas as pd
import math
import traceback
import re
from operator import itemgetter
import copy
import string
# def taxOnlyAmts(max_amt,cgst,amts):

#     second_max = amts[0]

#     for i in range(2):
#         if second_max < 0.84 * max_amt:
#             if len(amts) > 1 and i == 0:
#                 second_max = amts[1]
#                 continue
#             return {}
#         elif (max_amt != second_max) and math.isclose(max_amt,
#                                                       second_max,
#                                                       abs_tol = 0.8):
#             if len(amts) > 1 and i == 0:
#                 second_max = amts[1]
#                 continue
#             return {}

#         totalGst = max_amt - second_max
#         # print("CGST",
#         #       cgst,
#         #       totalGst,
#         #       max_amt,
#         #       second_max)
#         # commented after first 15 test
#         # if totalGst < second_max * .024:
#         #     if len(amts) > 1 and i == 0:
#         #         second_max = amts[1]
#         #         continue
#         #     return {}

#         totalGstPresent = True in (math.isclose(totalGst,
#                                                 amt,
#                                                 abs_tol = 1.0) for amt in amts)
#         gst = totalGst
#         if cgst == 1:
#             gst = totalGst / 2.0
#         elif cgst == -1:
#             gstPresent = True in (math.isclose(gst,
#                                                amt,
#                                                abs_tol = 1.0) for amt in amts)
#             if not gstPresent:
#                 gst = totalGst / 2.0
#                 gstPresent = True in (math.isclose(gst,
#                                                    amt,
#                                                    abs_tol = 1.0) for amt in amts)
#                 if gstPresent:
#                     cgst = 1
#             else:
#                 cgst = 0

#         # print("GST",cgst,gst,gstPresent)

#         gstPresent = True in (math.isclose(gst,
#                                            amt,
#                                            abs_tol = 1.0) for amt in amts)
#         # print("CGST",
#         #       cgst,
#         #       totalGst,
#         #       max_amt,
#         #       second_max,
#         #       gstPresent)
#         if not gstPresent and not totalGstPresent:
#             if len(amts) > 1 and i == 0:
#                 second_max = amts[1]
#                 continue
#             return {}
#         else:
#             if cgst:
#                 return {"total":max_amt,
#                         "subTotal":second_max,
#                         "cgst":gst,
#                         "sgst":gst,
#                         "igst":0.0,
#                         "totalGst":totalGst}
#             else:
#                 return {"total":max_amt,
#                         "subTotal":second_max,
#                         "cgst":0.0,
#                         "sgst":0.0,
#                         "igst":gst,
#                         "totalGst":totalGst}
vendorGSTIN_list = ['27AAFCD3317F1ZY','37AAFCD3317F1ZX','24AAFCD3317F1Z4','23AAFCD3317F1Z6','19AAFCD3317F1ZV',
'04AAFCD3317F1Z6','32AAFCD3317F1Z7','33AAFCD3317F1Z5','29AAFCD3317F1ZU','36AAFCD3317F1ZZ','06AAFCD3317F1Z2']

def taxOnlyAmts(max_amt,cgst,amts):

    for i in range(3):
        second_max = amts[i]
        if second_max < 0.84 * max_amt:
            if len(amts) > 1 and i <= 1:
                continue
            return {}
        elif (max_amt != second_max) and math.isclose(max_amt,
                                                      second_max,
                                                      abs_tol = 0.8):
            if len(amts) > 1 and i <= 1:
                continue
            return {}

        totalGst = max_amt - second_max
        print("CGST",
              cgst,
              totalGst,
              max_amt,
              second_max,
              totalGst < second_max * .024)

        totalGstPresent = True in (math.isclose(totalGst,
                                                amt,
                                                abs_tol = 1.0) for amt in amts)
        gst = totalGst
        if cgst == 1:
            gst = totalGst / 2.0
        elif cgst == -1:
            gstPresent = True in (math.isclose(gst,
                                               amt,
                                               abs_tol = 1.0) for amt in amts)
            if not gstPresent:
                gst = totalGst / 2.0
                gstPresent = True in (math.isclose(gst,
                                                   amt,
                                                   abs_tol = 1.0) for amt in amts)
                if gstPresent:
                    cgst = 1
            else:
                cgst = 0

        gstPresent = True in (math.isclose(gst,
                                           amt,
                                           abs_tol = 1.0) for amt in amts)
        print("CGST",
              cgst,
              totalGst,
              max_amt,
              second_max,
              gstPresent)
        if not gstPresent and not totalGstPresent:
            if len(amts) > 1 and i <= 1:
                continue
            return {}
        else:
            if cgst:
                return {"total":max_amt,
                        "subTotal":second_max,
                        "cgst":gst,
                        "sgst":gst,
                        "igst":0.0,
                        "totalGst":totalGst}
            else:
                return {"total":max_amt,
                        "subTotal":second_max,
                        "cgst":0.0,
                        "sgst":0.0,
                        "igst":gst,
                        "totalGst":totalGst}
                
def check_if_cgst_1(df):
    """
    Parameters
    ----------
    df : TYPE - Dataframe
        DESCRIPTION.

    Returns
    -------
    cgst : TYPE integer flag default -1, 1 true, 0 false
        DESCRIPTION.

    """
    cgst = -1
    try:    
        unqGSTins = list(df[df["is_gstin_format"] == 1]["text"])
        unqGSTins = list(set(unqGSTins))
        GSTIN_PATTERN = r"\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}"
        #Cgst or Igst
        if len(unqGSTins) > 1:
            firstGSTIN = unqGSTins[0]
            secondGSTIN = unqGSTins[1]
            first_span = re.search(GSTIN_PATTERN, firstGSTIN).span()
            firstGSTIN = firstGSTIN[first_span[0]:first_span[1]]
            second_span = re.search(GSTIN_PATTERN, secondGSTIN).span()
            secondGSTIN = secondGSTIN[second_span[0]:second_span[1]]
    
            # if vendorGstin[:2] == billingGstin[:2]:
            if firstGSTIN[:2] == secondGSTIN[:2]:
                cgst = 1
            else:
                cgst = 0
        return cgst
    except:
        print("exception",traceback.print_exc())
        
        return cgst

def check_if_cgst(prediction:dict):
    """
    Parameters
    ----------
    df : TYPE - dictionary
        DESCRIPTION.

    Returns
    -------
    cgst : TYPE integer flag default -1, 1 true, 0 false
        DESCRIPTION.

    """

    cgst = -1
    try:
        vendorGSTIN = prediction.get("vendorGSTIN")
        billingGSTIN = prediction.get("billingGSTIN")
        isVendorGSTIN = (vendorGSTIN and (vendorGSTIN.get("text")!= '' or vendorGSTIN.get("text") is not None))
        isBillingGSTIN = (billingGSTIN and (billingGSTIN.get("text")!= '' or billingGSTIN.get("text") is not None))
        if (isVendorGSTIN and isBillingGSTIN):
            vendorGSTIN = vendorGSTIN.get("text")
            billingGSTIN = billingGSTIN.get("text")
            #Cgst or Igst
            if vendorGSTIN[:2] == billingGSTIN[:2]:
                cgst = 1
            else:
                cgst = 0
        return cgst
    except:
        print("check_if_cgst exception :",traceback.print_exc())
        return cgst

    
# def calcAmountFields(df,prediction:dict):
#     try:
#         #Get vendor and buyer gstin
#         # vendorGstins = list(df[df["predict_label"] == 'vendorGstin']["text"])
#         # vendorGstins = list(set(vendorGstins))
#         # vendorGstin = vendorGstins[0]
#         # billingGstins = list(df[df["predict_label"] == 'billingGstin']["text"])
#         # billingGstins = list(set(billingGstins))
#         # billingGstin = billingGstins[0]

#         # Get tax structure from prediction file
#         cgst = check_if_cgst(prediction)

#         # # Get tax structure from dataframe file
#         # cgst = check_if_cgst_1(df)
        
#         #Get all extracted amounts
#         max_line_row = max(list(df["line_row"]))

#         df_amt = df[(df["extracted_amount"] > 0) & (df["extracted_amount"] < 1000000) & 
#                     ((df["line_row"] == 0) | (df["line_row"] == max_line_row))]
#         ocr_amts = list(df_amt["extracted_amount"])
#         unq_amts = list(set(ocr_amts))
#         unq_amts = sorted(unq_amts,
#                           reverse = True)

#         #loop through top 5 highest amounts only
#         max_range = min(3,len(unq_amts))
#         for i in range(0,max_range):
#             max_amt = unq_amts[i]
#             amts = unq_amts[i+1:]
#             if len(amts) > 0:
#                 result = taxOnlyAmts(max_amt,
#                                      cgst,
#                                      amts)
#                 # print("max",max_amt,result)
#                 if result == {}:
#                     continue
#                 else:
#                     # print(result)
#                     return result
#             else:
#                 break
#         # result = {"total":unq_amts[0],
#         #           "subTotal":unq_amts[0],
#         #           "cgst":0.0,
#         #           "sgst":0.0,
#         #           "igst":0.0,
#         #           "totalGst":0.0}
#         # print(result)
#         # return result
#         return None
#     except:
#         print(traceback.print_exc(),
#               "Calc Amount Fields")
#         return None

def calcAmountFields(df,vendor_masterdata,prediction=None):
    try:
        # #Get tax structure from prediction file
        # cgst = check_if_cgst(prediction)

        # Get tax structure from dataframe file
        cgst = check_if_cgst_1(df)
        if cgst == -1:
            print("Can't identify tax structure")
            return None
        #Get all extracted amounts
        max_line_row = max(list(df["line_row"]))

        # Commented the limit  total amount extraction limit 25 Nov
        df_amt = df[(df["extracted_amount"] > 0) & # (df["extracted_amount"] < 1000000) & 
                    ((df["line_row"] == 0) | (df["line_row"] == max_line_row))]
        # Commented the limit  total amount extraction limit 25 Nov

        amts_token_id = list(zip(df_amt["token_id"],df_amt["extracted_amount"]))
        ocr_amts = list(df_amt["extracted_amount"])
        # print("ocr_amts",ocr_amts)
        unq_amts = sorted(list(set(ocr_amts)),reverse = True)
        amts_token_id = sorted(amts_token_id,reverse = True,key=itemgetter(1))
        # print("ocr_amts_token_id",amts_token_id)

        #loop through top 5 highest amounts only
        max_range = min(3,len(unq_amts))
        for i in range(0,max_range):
            max_amt = unq_amts[i]
            amts = unq_amts[i+1:]
            if len(amts) > 0:
                print("checking for ",max_amt,amts)
                result = taxOnlyAmts(max_amt,
                                     cgst,
                                     amts)
                print("result",result)
                if result == {}:
                    continue
                else:
                    result_with_token = {}
                    print("taxOnlyAmts result",result)
                    total_amt_val_tokens = [tup for tup in amts_token_id if abs(tup[1]-result.get("total"))<0.9]
                    total_amt_val_tokens = sorted(total_amt_val_tokens,reverse=True,key=itemgetter(0))
                    print("total_amt_val_tokens :",total_amt_val_tokens)
                    if vendor_masterdata.get('VENDOR_GSTIN') in vendorGSTIN_list:
                        if check_totalAmount(df,total_amt_val_tokens):
                            result_with_token["totalAmount"] = total_amt_val_tokens[0]
                            print("Total Amount has Keyword")
                        else:
                            print("Total Amount has No Keyword")
                            # return None
                            continue
                    else:
                        result_with_token["totalAmount"] = total_amt_val_tokens[0]
                    subtotal_amt_val_tokens = [tup for tup in amts_token_id if abs(tup[1]-result.get("subTotal"))<0.9]
                    subtotal_amt_val_tokens = sorted(subtotal_amt_val_tokens,reverse=True,key=itemgetter(0))
                    print("subtotal_amt_val_tokens :",subtotal_amt_val_tokens)
                    result_with_token["subTotal"] = subtotal_amt_val_tokens[0]                    
                    cgst_amt_val_tokens = [tup for tup in amts_token_id if abs(tup[1]- result.get("cgst")) < 0.9]
                    print("cgst_amt_val_tokens :",cgst_amt_val_tokens)
                    if (result.get("cgst")> 0) & (len(cgst_amt_val_tokens)>=2):
                        if vendor_masterdata.get('VENDOR_GSTIN') in vendorGSTIN_list:
                            if check_cgst(df,cgst_amt_val_tokens):
                                print("GST has Keyword")
                                result_with_token["CGSTAmount"] = cgst_amt_val_tokens[0]                   
                                result_with_token["SGSTAmount"] = cgst_amt_val_tokens[1]
                            else:
                                print('Gst amount has No Keyword')
                                # return None
                                continue
                        else:
                            result_with_token["CGSTAmount"] = cgst_amt_val_tokens[0]                   
                            result_with_token["SGSTAmount"] = cgst_amt_val_tokens[1]
                    else :
                        if vendor_masterdata.get('VENDOR_GSTIN') in vendorGSTIN_list:
                            return None
                    igst_amt_val_tokens = [tup for tup in amts_token_id if abs(tup[1]-result.get("igst"))<0.9]
                    print("igst_amt_val_tokens :",igst_amt_val_tokens)
                    if result.get("igst")> 0:
                        if vendor_masterdata.get('VENDOR_GSTIN') in vendorGSTIN_list:
                            print("check_igst(df,igst_amt_val_tokens) :",check_igst(df,igst_amt_val_tokens))
                            if check_igst(df,igst_amt_val_tokens):
                                result_with_token["IGSTAmount"] = igst_amt_val_tokens[0]
                                #return result_with_token
                            else:
                                # return None
                                continue
                        else:
                            result_with_token["IGSTAmount"] = igst_amt_val_tokens[0]                    
                    print("result_with_token:",result_with_token)
                    return result_with_token
            else:
                break
        # result = {"total":unq_amts[0],
        #           "subTotal":unq_amts[0],
        #           "cgst":0.0,
        #           "sgst":0.0,
        #           "igst":0.0,
        #           "totalGst":0.0}
        # print(result)
        # return result
        return None
    except:
        print(traceback.print_exc(),
              "Calc Amount Fields")
        return None
def enchant_distance(text):
    try :
        import enchant
        tokens = str(str(text).lower()).translate(str.maketrans('', '', string.punctuation)).split()
        # print("tokens11 :",tokens,type(tokens))
        for w in tokens:
            distance = enchant.utils.levenshtein("total", w)
            # print("dist :",distance)
            if (distance == 0 or distance ==1):
                return distance
        return distance
    except:
        print("enchant_distance exception",traceback.print_exc())
        return -1

def check_totalAmount(df,total_amt_val_tokens):
    print("total_amt_val_tokens :",total_amt_val_tokens[0][0])
    # Updated logic to loop over all the tiken and check Dec 9
    # df_token=df[df['token_id']==total_amt_val_tokens[0][0]]
    try:
        for i  in total_amt_val_tokens:
            print(" i tuples :",i)
            df_token=df[df['token_id']==i[0]]
            print("df_token :",df_token.shape)
            for row in df_token.itertuples():
                # to fix ocr issue with label extraction amd matching added enchant dist cal.
                # if ("total" in row.left_processed_ngbr.lower()):
                distance = enchant_distance(row.left_processed_ngbr)
                if (("total" in row.left_processed_ngbr.lower()) | (distance in [0,1])):
                    return True
                # to fix ocr issue with label extraction amd matching added enchant dist cal.
                # Fixed the bug iterrating over all the token Dec 9
                # else:
                #     return False
                # Fixed the bug iterrating over all the token Dec 9
        return False
    # Updated logic to loop over all the tiken and check Dec 9
    except :
        print("check_totalAmount Exception",traceback.print_exc())
        return False

def check_igst(df,igst_amt_val_tokens):
    try:
        # Updated logic to loop over all the tiken and check Dec 9
        # df_token=df[df['token_id']==igst_amt_val_tokens[0][0]]
        for tuples in igst_amt_val_tokens:
            df_token=df[df['token_id']== tuples[0]]
            print("df_token shape :",df_token.shape)
            for row in df_token.itertuples():
                left_ngb_words = str(row.left_processed_ngbr.lower()).translate(str.maketrans('', '', string.punctuation))
                print("left_ngb_words withiut punctuations :",left_ngb_words)
                above_ngb_words = str(row.above_processed_ngbr.lower()).translate(str.maketrans('', '', string.punctuation))
                print("above_ngb_words withiut punctuations :",above_ngb_words)
                A = any("igst" == word.lower() in word for word in left_ngb_words.split()) or any("igst" == word.lower() in word for word in above_ngb_words.split())
                B = any("integrated" == word.lower() in word for word in left_ngb_words.split()) or any("integrated" == word.lower() in word for word in above_ngb_words.split())

                # A= ("igst" in row.left_processed_ngbr.lower()) or ("igst" in row.above_processed_ngbr.lower())
                # # B= ("integrated" in row.left_processed_ngbr.lower()) or ("integrated" in row.above_processed_ngbr.lower())
                if A or B:
                    return True
                # else:
                #     return False
        return False
        # Updated logic to loop over all the tiken and check Dec 9
    except :
        print("check_igst Exception :",traceback.print_exc())
        return False
        
def check_cgst(df,cgst_amt_val_tokens):
    try:
        # print("cgst_amt_val_tokens 1:",cgst_amt_val_tokens)
        # Updated logic to loop over all the tiken and check Dec 9
        #df_token=df[df['token_id']==cgst_amt_val_tokens[0][0]]
        for tuples in cgst_amt_val_tokens:
            df_token=df[df['token_id']==tuples[0]]            
            print("df_token shape :",df_token.shape)
            for row in df_token.itertuples():
                # A= ("gst" in row.left_processed_ngbr.lower()) or ("gst" in row.above_processed_ngbr.lower())
                # B = ("central" in row.above_processed_ngbr.lower()) or ("state" in row.above_processed_ngbr.lower())
                left_ngb_words = str(row.left_processed_ngbr.lower()).translate(str.maketrans('', '', string.punctuation))
                print("left_ngb_words withiut punctuations :",left_ngb_words)
                above_ngb_words = str(row.above_processed_ngbr.lower()).translate(str.maketrans('', '', string.punctuation))
                print("above_ngb_words withiut punctuations :",above_ngb_words)
                A = any("cgst" == word.lower() in word for word in left_ngb_words.split()) or any("sgst" == word.lower() in word for word in above_ngb_words.split())
                B = any("central" == word.lower() in word for word in above_ngb_words.split()) or any("state" == word.lower() in word for word in above_ngb_words.split())
                print("condition A ,B",A,B)    
                if A or B:
                    print("row.left_processed_ngbr.lower() :",row.left_processed_ngbr.lower())
                    print("row.above_processed_ngbr.lower() :",row.above_processed_ngbr.lower())
                    return True
                # else:
                #     return False
        return False
    # Updated logic to loop over all the tiken and check Dec 9
    except :
        print("check_cgst Exception",traceback.print_exc())
        return False

def assignVavluesToDf(col_name,col_vals,df,
                      base_col = "token_id"):
    import numpy as np
    new_col = col_name + "_new"
    df[new_col] = df[base_col].map(col_vals)
    df[col_name] = np.where(df[new_col].isnull(),
                            df[col_name],
                            df[new_col])
    return df

def reduce_confidence(df,amount_fields):
    try:
        for field in amount_fields.keys():
            tokens = df[df["prob_"+field]>0.9]['token_id']
            tokens = tokens.to_list()
            if len(tokens)>0:
                print("tokens to reduce confidence :",tokens)
                for tk in tokens:
                    # print("befor Reducing confidence :",df[df["token_id"]==tk]["prob_"+field])
                    # print("befor changing label :",df[df["token_id"]==tk]["predict_label"])
                    df = assignVavluesToDf("predict_label",{tk:"unknown"},df)
                    df = assignVavluesToDf(("prob_" + field),{tk:0.8},df)
                    # print("After Reducing confidence :",df[df["token_id"]==tk]["prob_"+field])
                    # print("After changing label :",df[df["token_id"]==tk]["predict_label"])
        return df
    except:
        print("reduce_confidence exception",traceback.print_exc())
        return df
    
def updated_amount_field_prob_label(df,vendor_masterdata):
    copy_df = df.copy(deep = True)
    try:
        amount_fields = calcAmountFields(df,vendor_masterdata)
        print("calcAmountFields result :",amount_fields)
        if amount_fields:
            df = reduce_confidence(df,amount_fields)
            for key, val in amount_fields.items():
                # print("tkn lbl",{val[0]:key},{val[0]:1.0})
                df = assignVavluesToDf("predict_label",{val[0]:key},df)
                df = assignVavluesToDf(("prob_" + key),{val[0]:1.0},df)
        return df
    except:
        print("updated_amount_field_prob_label exception",traceback.print_exc())
        return copy_df


if __name__ == "__main__":
    import pandas as pd
    path = r"C:\Users\OVE\Downloads\2a030359-504b-11ed-99bd-80ce62234e48_pred.csv"
    df=pd.read_csv(path)
    df = updated_amount_field_prob_label(df)
    
    
    
    
    