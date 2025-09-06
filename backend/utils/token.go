package utils

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateAccessToken(userId int, username string) (string, error) {
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

func ParseRefreshToken(tokenStr string) (jwt.MapClaims, error) {
	jwtSecret := os.Getenv("JWT_SECRET_KEY")

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		// Refuse les algos inattendus
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid claims type")
	}

	// Vérifie l'expiration (si non déjà faite par la lib)
	if exp, ok := claims["exp"].(float64); ok {
		if time.Unix(int64(exp), 0).Before(time.Now()) {
			return nil, errors.New("token expired")
		}
	}
	return claims, nil
}