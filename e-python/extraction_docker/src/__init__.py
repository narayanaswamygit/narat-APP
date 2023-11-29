# -*- coding: utf-8 -*-
"""
Created on Fri Oct 22 22:22:51 2021

@author: Hari
"""

from klein import Klein
import config
# import submit_post as upd_auth
# import delete_files_from_blob as del_file_auth
import extraction_api as extraction
# import preprocessor_api as preprocess
# import extraction_submit_api as extraction_submit
# import ocr_api as ocr


app = Klein()
appPort = config.getExtractionApiPort()

# @app.route('/authtoken/status/update', methods=['POST'])
# def auth_upd_status(request):
#     try:
#         rawContent = request.content.read()
#         encodedContent = rawContent.decode("utf-8")
#         return upd_auth.update_db(encodedContent)
#     except:
#         return json.dumps({"status":"Error in calling update status"})

# @app.route('/authtoken/delete/files', methods=['POST'])
# def auth_delete_files(request):
#     try:
#         rawContent = request.content.read()
#         encodedContent = rawContent.decode("utf-8")
#         return del_file_auth.delete_records(encodedContent)
#     except:
#         return json.dumps({"response_code":200})

@app.route('/extraction/submit', methods = ['POST'])
def extraction_submit(request):
    return extraction.extractionApi(request)


# @app.route('/extraction/submit', methods = ['POST'])
# def extraction_submit(request):
#     return extraction_submit.extractionSubmitApi(request)

# @app.route('/extraction/preprocess', methods = ['POST'])
# def preprocess_submit(request):
#     return preprocess.preprocessApi(request)

# @app.route('/extraction/ocr', methods = ['POST'])
# def ocr_submit(request):
#     return extraction.extractionApi(request)

# @app.route('/extraction/features', methods = ['POST'])
# def extract_features_submit(request):
#     return extraction.extractionApi(request)

if __name__ == "__main__":
    app.run("0.0.0.0", appPort)

