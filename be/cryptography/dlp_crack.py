from flask import request, jsonify, Blueprint
from utils import shank_dlp
from sympy import isprime
from math import sqrt, floor

dlp_crack = Blueprint('dlp_crack', __name__)

@dlp_crack.route('/dlp_crack', methods=['GET'])
def get_dlp_crack():
    """
    Calculate the discrete logarithm using the Baby-step Giant-step algorithm.
    The function takes three integers 'g', 'y', and 'p' as query parameters and returns the discrete logarithm x such that g^x ≡ y (mod p).
    """
    g = request.args.get('g', type=int)
    y = request.args.get('y', type=int)
    p = request.args.get('p', type=int)
    if g is None or y is None or p is None:
        return jsonify({"error": "Please provide 'g', 'y', and 'p' as query parameters."}), 400
    if not isprime(p):
        return jsonify({"error": "p must be a prime number."}), 400
    if y >= p:
        return jsonify({"error": "y must be less than p."}), 400
    shank_dlp_result = shank_dlp(g, y, p)
    if shank_dlp_result is None:
        return jsonify({"error": "No solution found."}), 411
    return jsonify({"x": shank_dlp_result[1]*floor(1+sqrt(p))+shank_dlp_result[0], "i": shank_dlp_result[0], "j": shank_dlp_result[1]}), 200