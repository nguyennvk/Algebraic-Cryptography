from flask import request, jsonify, Blueprint
from utils import polinomial_modulo
poly_gcd = Blueprint('poly_gcd', __name__)
@poly_gcd.route('/poly_gcd', methods=['POST'])
def post_poly_gcd():
    """
    Perform polynomial modulo operation in GF(p).
    """
    #Sanitize input
    data = request.get_json()
    if not data:
        return jsonify({"error": "Please provide a JSON body with 'poly1', 'poly2', and 'p' parameters."}), 400
    poly1 = {int(k): v for k, v in data.get('poly1').items()}
    poly2 = {int(k): v for k, v in data.get('poly2').items()}
    p = data.get('p')
    if poly1 is None or poly2 is None or p is None:
        return jsonify({"error": "Please provide 'poly1', 'poly2', and 'p' parameters."}), 400
    # Perform polynomial modulo operation
    def is_zero(poly):
        """
        Check if a polynomial is zero.
        """
        return all(coef == 0 for coef in poly.values())
    def poly_euclid(a, b, p):
        """
        Perform polynomial Euclidean algorithm to find GCD.
        """
        while is_zero(b) == False:
            a, b = b, polinomial_modulo(a, b, p)
        return a
    return jsonify(poly_euclid(poly1, poly2, p)), 200