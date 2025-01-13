import random
import string
from datetime import datetime
import bcrypt
from backend.logging_config import logger
from sqlalchemy.orm import Session
from backend.models import Client, Order_product, Port, Operation, Product, Ship, UserRole
from backend.models.ship import ShipStatus
from backend.models.operation import OperationType
from backend.models.order import Order
from backend.database import get_db

cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'London', 'Paris',
    'Berlin', 'Madrid', 'Rome', 'Tokyo', 'Sydney', 'São Paulo',
    'Moscow', 'Cairo', 'Bangkok', 'Dubai', 'Cape Town', 'Seoul']

def db_filler():
    db: Session = next(get_db())
    generate_clients(db)
    generate_ports(db)
    generate_products(db)
    generate_ships(db)
    generate_operations(db)

def generate_clients(db:Session):

    first_names = [
    'Richard', 'Joseph', 'Charles', 'Thomas', 'Christopher',
    'Daniel', 'Paul', 'Mark', 'Donald', 'George', 'Kenneth',
    'Steven', 'Edward', 'Brian', 'Ronald', 'Anthony', 'Kevin',
    'Jason', 'Matthew', 'Gary', 'Timothy', 'Jose', 'Larry',
    'Jeffrey', 'Frank', 'Emma', 'Olivia', 'Sophia', 'Isabella',
    'Charlotte', 'Amelia', 'Evelyn', 'Abigail', 'Harper', 'Ella',
    'Avery', 'Scarlett', 'Grace', 'Chloe', 'Camila', 'Aria',
    'Lily', 'Layla', 'Zoe', 'Mila', 'Nora', 'Riley', 'Hazel']
    streets = [
    'Main Street', 'Oak Avenue', 'Pine Road', 'Maple Street',
    'Elm Street', 'River Road', 'Sunset Boulevard', 'Park Lane',
    'King Street', 'Queen Street', 'Cedar Avenue', 'Lake Drive', 
    'Mountain Road', 'Hill Street', 'Rose Street', 'Garden Lane',
    'Church Street', 'Lakeside Drive', 'First Avenue','Bright Street',
    'Second Street','Tenth Street', 'Beautiful Lane', 'Sunny Road',
    'Greenwood Avenue', 'Quiet Lane', 'Golden Boulevard', 'Crystal Road',
    'Silver Street', 'Bluebell Road', 'Grace Avenue', 'Horizon Boulevard']
    username_parts = [
    'Sky', 'Blue', 'Star', 'Rain', 'Sun', 'Wind', 'Fire', 'Moon',
    'Wolf', 'Bear', 'Cat', 'Dog', 'Fish', 'Bird', 'Lion', 'Fast',
    'Quick', 'Bright', 'Bold', 'Green', 'Gentle', 'Sharp', 'Strong',
    'Smart', 'Swift', 'Clear', 'Silent', 'Calm', 'Clear', 'Fresh',
    'Neat', 'Clear', 'Wide', 'True', 'Sharp']
    email_domains = [
    'gmail', 'yahoo', 'outlook', 'hotmail', 'aol',
    'icloud', 'live', 'msn', 'yandex', 'mail']
    domain_extensions = [
    '.com', '.pl', '.org', '.net', '.edu',
    '.gov', '.co', '.info', '.io', '.us']
    
    for _ in range(30):
        part1, part2 = random.sample(username_parts, 2)
        digits = random.randint(0, 99)
        logon_name = part1 + part2 + str(digits)

        existing_user = db.query(Client).filter(Client.logon_name == logon_name).first()

        if not existing_user:
            password = ''.join(random.choice(string.ascii_letters + string.digits
                                                  ) for _ in range(random.randint(8, 15)))
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            new_user = Client(
                name = random.choice(first_names),
                address = random.choice(cities) + " " + random.choice(streets) + 
                " " + str(random.randint(1, 99)) + " " + str(random.randint(10, 99)) + 
                "-" + str(random.randint(100, 999)),
                telephone_number=str(random.randint(100000000, 999999999)),
                email = part1 + part2 + "@" + random.choice(email_domains) +
                random.choice(domain_extensions),
                logon_name=logon_name,
                password=hashed_password,
                role=UserRole.CLIENT if random.random() < 0.6 else UserRole.EMPLOYEE
            )
            db.add(new_user)

    logger.info(f"Created {len(db.new)} users successfully.")
    db.commit()
    for new_record in db.new:
        db.refresh(new_record)

def generate_ports(db: Session):
    port_names1 = [
        'South', 'East', 'West', 'North', 'Center', 
        'Main', 'New', 'Old', 'Grand', 'Saint', 'First']
    port_names2 = [
        'Alpha', 'Bravo', 'Delta', 'Echo', 'Zulu', 
        'Sierra', 'Tango', 'Charlie', 'Foxtrot', 'Golf']
    countries = [
        'USA', 'UK', 'Germany', 'France', 'Japan', 'Australia',
        'Brazil', 'China', 'Russia', 'South Africa', 'Egypt'
    ]
    
    for _ in range(30):
        port_name = random.choice(port_names1)+" "+random.choice(port_names2)
        existing_port = db.query(Port).filter(Port.name == port_name).first()

        if not existing_port:
            new_port = Port(
                name=port_name,
                location=random.choice(cities),
                country=random.choice(countries)
            )
            db.add(new_port)
    
    logger.info(f"Created {len(db.new)} ports successfully.")
    db.commit()
    for new_record in db.new:
        db.refresh(new_record)

def generate_products(db: Session):
    product_names = [
    'Sofa', 'Table', 'Chair', 'Armchair', 'Bed', 'Shelf', 'Desk',
    'Wardrobe', 'Dresser', 'Coffee Table', 'Garden Furniture Set',
    'Pallets', 'Scaffolding', 'Cement', 'Glass', 'Gypsum', 'Asbest',
    'Marble Countertop', 'Fiberglass', 'Mattresses', 'Forklift',
    'Lifter', 'Electric Cable', 'Welding Kit', 'Hydraulic Pump']
    
    price_range = (1, 200)
    weight_range = (1, 1000)
    
    ports = db.query(Port).all()

    for _ in range(30):
        name = random.choice(product_names)+" #"+''.join(random
            .choices(string.ascii_uppercase + string.digits, k=7))
        port = random.choice(ports).id_port

        existing_product = db.query(Product).filter(Product.name == name, Product.id_port == port).first()

        if not existing_product:
            created_at = datetime.now()

            new_product = Product(
                name=name,
                price=round(random.uniform(*price_range), 2)*100,
                weight=round(random.uniform(*weight_range), 2)*10,
                created_at=created_at,
                updated_at=created_at,
                image="",
                id_port=port
            )
            db.add(new_product)

    logger.info(f"Created {len(db.new)} products successfully.")
    db.commit()
    for new_record in db.new:
        db.refresh(new_record)

def generate_ships(db: Session):
    ship_names1 = [
        'Titanic', 'Queen', 'Oasis', 'Explorer', 
        'Voyager', 'Radiance', 'Enchantment'
    ]
    ship_names2 = [
        'Titanic', 'Mary', 'Seas', 'Symphony', 'Independence',
        'Liberty', 'Freedom', 'Adventure', 'Brilliance'
    ]
    
    capacity_range = (100, 3000)
    
    for _ in range(30):
        name = random.choice(ship_names1)+" of "+random.choice(ship_names2)
        capacity = random.randint(*capacity_range)
        existing_ship = db.query(Ship).filter(Ship.name == name).first()
        if not existing_ship:
            created_at = datetime.now()
            new_ship = Ship(
                name=name,
                capacity=capacity,
                status=random.choice([ShipStatus.ACTIVE, ShipStatus.INACTIVE]),
                created_at=created_at,
                updated_at=created_at,
                image=""
            )
            db.add(new_ship)

    logger.info(f"Created {len(db.new)} ships successfully.")
    db.commit()
    for new_record in db.new:
        db.refresh(new_record)

def generate_operations(db: Session):
    
    operation_types = list(OperationType)

    ships = db.query(Ship).all()
    ports = db.query(Port).all()
    orders = db.query(Order).all()

    for _ in range(30):
        operation_type = random.choice(operation_types)
        date_of_operation = datetime.now()
        
        ship = random.choice(ships)
        port = random.choice(ports)
        order = random.choice(orders)
        
        existing_operation = db.query(Operation).filter(
            Operation.operation_type == operation_type,
            Operation.id_ship == ship.id_ship,
            Operation.id_port == port.id_port,
            Operation.id_order == order.id_order
        ).first()

        if not existing_operation:
            name_of_operation=str(operation_type.value).lower().replace('_', ' ')
            name_of_operation=name_of_operation[0].upper() + name_of_operation[1:]

            new_operation = Operation(
                name_of_operation = name_of_operation +" #"+''.join(random
            .choices(string.ascii_uppercase + string.digits, k=7)),
                operation_type=operation_type,
                date_of_operation=date_of_operation,
                id_ship=ship.id_ship,
                id_port=port.id_port,
                id_order=order.id_order
            )
            db.add(new_operation)

    logger.info(f"Created {len(db.new)} operations successfully.")
    db.commit()
    for new_record in db.new:
        db.refresh(new_record)