Create database DadShop;
use DadShop;

Create table customers(
customer_id int auto_increment primary key,
first_name varchar(255) not null,
last_name varchar(255) not null,
phone_number varchar(20),
email varchar(255) unique
);

Create table accounts(
customer_id int primary key,
username varchar(255) not null unique,
password_hash varchar(255),
google_id varchar(255) unique,
created_at timestamp default current_timestamp,
foreign key (customer_id) references customers(customer_id) on delete cascade
);

Create table vehicles(
car_id int auto_increment primary key,
customer_id int not null,
year_produced int,
make varchar(255),
model varchar(255),
odometer int,
license_plate varchar(20),
vin varchar(17) unique,
foreign key (customer_id) references customers(customer_id) on delete cascade
);

Create table repairs(
repair_id int auto_increment primary key,
car_id int not null,
customer_id int not null,
transaction_id varchar(255) unique,
service_date date,
odometer_cur int,
category varchar(255),
customer_comments text,
mechanic_comments text,
total decimal(10,2),
payment_status ENUM('Unpaid', 'Pending', 'Paid') DEFAULT 'Unpaid',
payment_method ENUM('Cash','Zelle','Square','Other') NULL,
foreign key (car_id) references vehicles(car_id),
foreign key (customer_id) references customers(customer_id) on delete cascade
);

CREATE TABLE repair_items (
item_id INT AUTO_INCREMENT PRIMARY KEY,
repair_id INT NOT NULL,
description VARCHAR(255) NOT NULL,
item_type ENUM('Part','Labor','Fee') NOT NULL DEFAULT 'Part',
quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
unit_price DECIMAL(10,2) NOT NULL,
unit_cost DECIMAL(10,2) NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (repair_id) REFERENCES repairs(repair_id) ON DELETE CASCADE,
INDEX idx_repair_id (repair_id)
);

Create table appointments(
appointment_id int auto_increment primary key,
car_id int not null,
customer_id int not null,
app_date datetime not null,
status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
notes text,
foreign key (car_id) references vehicles(car_id),
foreign key (customer_id) references customers(customer_id) on delete cascade
);
