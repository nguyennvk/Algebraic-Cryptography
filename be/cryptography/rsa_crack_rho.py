from flask import request, jsonify, Blueprint
from sympy import factorint
from utils import eval_poly
from math import gcd, log2, floor

rsa_crack_rho = Blueprint('rsa_crack_rho', __name__)

@rsa_crack_rho.route('/rsa_crack_rho', methods=['POST'])
def post_rsa_crack_rho():
    """
    Calculate the prime factors of a given integer n using Pollard's rho algorithm.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Please provide a JSON body with 'n' parameter."}), 400
        n = data.get('n')
        if n is None:
            return jsonify({"error": "Please provide 'n' in the JSON body."}), 400
        poly = {int(k): v for k, v in data.get('poly').items()}
        if poly is None:
            return jsonify({"error": "Please provide 'poly' in the JSON body."}), 400
        
        x0 = data.get('x0')
        if x0 is None:
            return jsonify({"error": "Please provide 'x0' in the JSON body."}), 400
        limit = data.get('limit')
        if limit is None:
            limit = 100
        x_m = {0: x0}
        result = {"steps": [{"x_m": x0, "k": None, "x_k": None, "gcd": None}], "result": None}
        for i in range(1, limit):
            x_m[i] = eval_poly(poly, x_m[i-1]) % n
            k = floor(log2(i))
            x_k = x_m[2**k-1]
            gcd_i = gcd(abs(x_m[i] - x_k), n)
            result["steps"].append({"x_m": x_m[i], "k": k, "x_k": x_k, "gcd": gcd_i})
            if gcd_i != 1 and gcd_i != n:
                result["result"] = gcd_i
                break
        return jsonify(result), 200
    except:
        return jsonify({"error": "Unexpect error"}), 400

    


