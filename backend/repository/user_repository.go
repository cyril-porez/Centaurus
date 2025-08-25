package repository

import (
	"back-end-go/model"
	"database/sql"
	"time"
)

type SQLUserRepository struct {}

func (r *SQLUserRepository) InsertUser(db *sql.DB, user *model.User) error {
	user.CreatedAt = time.Now()
	query := "INSERT INTO users (username, password, email, created_at)	Values (?,?,?,?)"
	result, err := db.Exec(query, user.Username, user.Password, user.Email, user.CreatedAt)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	user.Id = int(id)

	return nil
}

func (r *SQLUserRepository) IsEmailTaken(db *sql.DB, email string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)"
	err := db.QueryRow(query, email).Scan(&exists)
	return exists, err
}

func (r *SQLUserRepository) IsUsernameTaken(db *sql.DB, email string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)"
	err := db.QueryRow(query, email).Scan(&exists)
	return exists, err
}

func (r *SQLUserRepository) SelectUserByCredential(db *sql.DB, email string) (*model.User, string, error) {
	var user model.User
	var	password string
	query := `SELECT
							id,
							username,
							password,
							email,
							created_at
						FROM users 
						WHERE email = ?`
	err := db.QueryRow(query, email).Scan(
		&user.Id, 
		&user.Username, 
		&password,
		&user.Email,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, "", err
	}

	user.Password = password
	return &user, password, err	
} 