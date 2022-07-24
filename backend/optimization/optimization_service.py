import numpy as np

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

from optimization_utils import get_tsp_result


app = Flask("Triplan Optimization Service")
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/", methods=(["POST"]))
def optimize():
    partner_locations = request.json

    # Find the sortable locations and their coordinates (latitudes and longitudes)
    sortable_locations = [loc for loc in partner_locations if "googleLocationInfo" in loc]
    location_coordinates = [
      (loc["googleLocationInfo"]["latitude"], loc["googleLocationInfo"]["longitude"])
      for loc in sortable_locations
    ]

    # Process only the "sortable" locations in the algorithm and keep the result in a dictionary
    location_indices_ordered, _ = get_tsp_result(location_coordinates)
    location_dict_ordered = {sortable_locations[loc_idx]["_id"]: loc_idx for loc_idx in location_indices_ordered}

    # Add the locations with no google location info to the dictionary by the order they were given in the request body
    min_idx_unordered = len(sortable_locations)
    unsortable_location_indices = [idx for (idx, loc) in enumerate(partner_locations) if "googleLocationInfo" not in loc]
    for i, unordered_loc_idx in enumerate(unsortable_location_indices):
      location_dict_ordered[partner_locations[unordered_loc_idx]["_id"]] = min_idx_unordered + i

    # Return the collected dictionary as a response 
    response = jsonify({ "response": location_dict_ordered })
    response.headers.add("Access-Control-Allow-Origin", "*")

    return make_response(response, 200)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=6006)
