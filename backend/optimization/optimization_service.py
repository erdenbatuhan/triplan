from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from optimization_utils import get_tsp_result
import numpy as np

app = Flask("KUAI App")
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/', methods=('POST',))
def optimize():
    place_order = [0]
    data = request.json
    if len(data) > 1:
      only_place_list = [p for p in data if p["partnerLocation"]["partnerType"] != "restaurant"]
      place_loc_list = [(p["partnerLocation"]["googleLocationInfo"]["latitude"], 
                        p["partnerLocation"]["googleLocationInfo"]["longitude"]) for p in only_place_list]
      place_id_list = [p["partnerLocation"]["_id"] for p in only_place_list]
      
      place_order, distance = get_tsp_result(place_loc_list)
    else:
      place_order = list(range(len(data) - 1))
    
    res = {"response": []}
    res["response"] = place_order
    response = jsonify(res)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return make_response(response, 201)

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=6006)
