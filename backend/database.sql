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
foreign key (car_id) references vehicles(car_id),
foreign key (customer_id) references customers(customer_id) on delete cascade
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
