from flask import request, jsonify, Blueprint
from math import lcm
from sympy import factorint
from utils import single_carmicheal


carmichael_func = Blueprint('carmichael_func', __name__)

@carmichael_func.route('/carmichael_func', methods=['GET'])
def get_carmicheal_func():
    """
    Calsulate the Carmichael function for a given integer 'n'.
    The function takes an integer 'n' as a query parameter and returns the value of the Carmichael function for 'n'.
    """
    n = request.args.get('n', type=int)
    if n is None:
        return jsonify({"error": "Please provide 'n' as query parameters."}), 400
    factorize = factorint(n)
    lcm_list = []
    for p, k in factorize.items():
        lcm_list.append(single_carmicheal(p, k))
    result = lcm_list[0]
    for i in range(1, len(lcm_list)):
        result = lcm(result, lcm_list[i])
    return jsonify({"result": result})
    


