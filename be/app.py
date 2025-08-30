from flask import Flask
from basic_arithmetic.gcd import gcd
from basic_arithmetic.bezout import bezout
from basic_arithmetic.multiplicative_inverse import mul_inverse
from basic_arithmetic.fast_power import fast_power
from primary_test.primary import primary
from basic_arithmetic.carmichael_func import carmichael_func
from field.generate_field import generate_field
from field.poly_modulo import poly_modulo
from field.poly_gcd import poly_gcd
from cryptography.dlp_crack import dlp_crack
from cryptography.rsa_crack import rsa_crack
from cryptography.rsa_crack_rho import rsa_crack_rho
from elliptic_curve.determinant import determinant
from elliptic_curve.points import points
from elliptic_curve.point_add import points_add
from elliptic_curve.point_multiplication import points_mul
from elliptic_curve.point_order import point_order
from digital_signature.rsa_signature import rsa_signature
from digital_signature.elgamal_signature import elgamal_signature
from digital_signature.elliptic_curve_signature import elliptic_curve_signature
from web_function.autofill import autofill_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Only allow React frontend

# Define the main entry point of the application
@app.route('/')
def index():
    return "A tool that helps MAT302 students calculate and visualize cryptography concepts."

app.register_blueprint(gcd)
app.register_blueprint(bezout)
app.register_blueprint(mul_inverse)
app.register_blueprint(fast_power)
app.register_blueprint(primary)
app.register_blueprint(carmichael_func)
app.register_blueprint(generate_field)
app.register_blueprint(poly_modulo)
app.register_blueprint(poly_gcd)
app.register_blueprint(dlp_crack)
app.register_blueprint(rsa_crack)
app.register_blueprint(rsa_crack_rho)
app.register_blueprint(determinant)
app.register_blueprint(points)
app.register_blueprint(points_add)
app.register_blueprint(points_mul)
app.register_blueprint(point_order)
app.register_blueprint(rsa_signature)
app.register_blueprint(elgamal_signature)
app.register_blueprint(elliptic_curve_signature)
app.register_blueprint(autofill_bp)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5555, debug=True)
