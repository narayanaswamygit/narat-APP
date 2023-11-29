import traceback
import requests
import json
import preProcUtilities as putil
import TAPPconfig as cfg
from polling import TimeoutException, poll

def send_request(auth_token, document_id, sub_id):
    try:
        url = cfg.getExtractionGetAPI()
        enc_token = putil.encryptMessage(json.dumps({
            "auth_token": auth_token,
            "documentId": document_id,
            "sub_id": sub_id
        }))
        enc_token = enc_token.decode("utf-8")
        message = json.dumps({"message": enc_token})
        headers = {"Content-Type": "application/json"}

        response = requests.post(url=url, headers=headers, data=message)
        if response.status_code != 200:
            return None
        
        resp_obj = response.json()
        resp_obj = putil.decryptMessage(resp_obj["message"])
        resp_obj = json.loads(resp_obj)
        
        if resp_obj["status_code"] != 200:
            return None
        
        return resp_obj
    except:
        return None

def check_response(response):
    if response is None:
        return True

    ext_status = response["status"]
    if (ext_status == "Processing" or ext_status == "Submitted"):
        return False
    else:
        return True

def poll_status(auth_token, delta, document_id, sub_id):
    try:
        polling_result = poll(
            lambda: send_request(auth_token, document_id, sub_id),
            check_success=check_response,
            step=10,
            timeout=delta
        )
        return polling_result
    except TimeoutException as te:
        # traceback.print_exc()
        print("Polling TimeOutException",te)
        return None
