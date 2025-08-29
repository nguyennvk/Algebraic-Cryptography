from flask import request, jsonify, Blueprint
from utils import polinomial_modulo
poly_modulo = Blueprint('poly_modulo', __name__)
@poly_modulo.route('/poly_modulo', methods=['POST'])
def post_poly_modulo():
    """
    Perform polynomial modulo operation in GF(p).
    """
    #Sanitize input
    data = request.get_json()
    if not data:
        return jsonify({"error": "Please provide a JSON body with 'dividend', 'divisor', and 'p' parameters."}), 400
    dividend = {int(k): v for k, v in data.get('dividend').items()}
    divisor = {int(k): v for k, v in data.get('divisor').items()}
    p = data.get('p')
    
    if dividend is None or divisor is None or p is None:
        return jsonify({"error": "Please provide 'dividend', 'divisor', and 'p' parameters."}), 400
    
    # Perform polynomial modulo operation
    result = polinomial_modulo(dividend, divisor, p)
    
    return jsonify(result), 200