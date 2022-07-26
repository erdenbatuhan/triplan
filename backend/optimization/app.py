import json
from flask import Flask, request as FlaskRequest, jsonify as FlaskJsonify
import src.optimization_service as optimization_service


# Constants
constants = None
with open("./constants.json") as file:
    constants = json.load(file)


# Initialize the Flask app
app = Flask(__name__)


@app.route("/optimize", methods=["POST"])
def optimize():
  partner_locations = json.loads(FlaskRequest.data)
  ordered_locations = optimization_service.optimize(partner_locations)

  return FlaskJsonify(ordered_locations), 200


if __name__ == "__main__":
    app.run(debug=True, host=constants["HOST"], port=constants["PORT"])
