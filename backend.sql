Create schema DadShop;
use DadShop;

Create table customers(
customer_id int auto_increment primary key,
first_name varchar(255) not null,
last_name varchar(255) not null,
phone_number varchar(20),
email varchar(255),
);

create table accounts(
customer_id int auto_increment primary key,
username varchar(255) not null,
password_hash varchar(255) not null,
created_at Timestamp default current_timestamp,
foreign key (customer_id) references customers(customer_id) on delete cascade
);


Create table vehicles(
car_id int auto_increment primary key,
customer_id int not null,
year_produced int,
make varchar(255),
model varchar(255),
odometer int,
vin varchar (17) unique,
foreign key (customer_id) references customers(customer_id) on delete cascade
);


Create table repairs(
repair_id int auto_increment primary key,
car_id int not null,
customer_id int not null,
transaction_id varchar(255),
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
status VARCHAR(50) DEFAULT 'Pending', -- Pending, Confirmed, Completed, Cancelled
notes text,
foreign key (car_id) references vehicles(car_id),
foreign key (customer_id) references customers(customer_id) on delete cascade
);



