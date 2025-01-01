package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateAccesToken(userId int, username string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	claims := jwt.MapClaims{
		"sub": userId,
		"username": username,
		"exp": time.Now().Add(time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func GenerateRefreshToken(userId int, username string) (string, error) {
  jwtSecret := os.Getenv("JWT_SECRET_KEY")
	claims := jwt.MapClaims{
		"sub":userId,
		"name": username,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
		"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}