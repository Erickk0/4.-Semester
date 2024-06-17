CREATE TABLE news
(
    newsid  int(11) NOT NULL AUTO_INCREMENT,
    time    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    message text      NOT NULL,
    PRIMARY KEY (newsid)
) charset='utf8'
