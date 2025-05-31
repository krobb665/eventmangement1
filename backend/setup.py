from setuptools import setup, find_packages

setup(
    name="event_management",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'Flask',
        'Flask-SQLAlchemy',
        'Flask-Migrate',
        'Flask-JWT-Extended',
        'Flask-Cors',
        'Flask-SocketIO',
        'python-dotenv',
        'psycopg2-binary',
    ],
)
