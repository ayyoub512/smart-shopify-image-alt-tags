

USE AltTextApp;


DESCRIBE shops;

CREATE TABLE `status`(
    id INT  NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    shopId INT NULL ,
    FOREIGN KEY (shopId) REFERENCES shops(id),
    status INT NOT NULL DEFAULT 0,
    templateValue VARCHAR(500), 
    updatedAt datetime DEFAULT CURRENT_TIMESTAMP
)

select * from status;

ALTER TABLE status ADD productsProcessed INT AFTER templateValue; 
