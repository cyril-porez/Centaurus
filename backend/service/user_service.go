package service

import (
	"back-end-go/interfaces"
	"back-end-go/model"
	"back-end-go/utils"
	"database/sql"
	"errors"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo interfaces.UserRepository
}

func NewUserService(repo interfaces.UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) CreateUser(c *gin.Context, db *sql.DB, input *model.RegisterInput) (*model.User,[]model.ErrorDetail, error) {
	var details []model.ErrorDetail
	
	if det, err := s.ValidateUsername(db, input.Username); err != nil || len(det) > 0 {
		return nil, append(details, det...), err
	}

	if det, err := s.ValidateEmail(db, input.Email); err != nil || len(det) > 0 {
		return nil, append(details, det...), err
	}

	if det, err := utils.ValidatePassword(input.Password); err != nil || len(det) > 0 {
		return nil, append(details, det...),err
	}

	hashedPAssword, err := utils.HashPassword(input.Password)
	if err != nil {
		utils.AddErrorDetail(&details, "password", "erreur lors du hashage du mot de passe")
		return nil, details, err
	}
	user := &model.User{
		Username: input.Username,
		Email: input.Email,
		Password: hashedPAssword,
		CreatedAt: time.Now(),
	}
	
	if err := s.repo.InsertUser(db, user); err != nil {
		return nil, nil, err
	}

	return user, nil, nil
}

func (s *UserService) ValidateEmail(db *sql.DB, email string) ([]model.ErrorDetail ,error) {
	var details []model.ErrorDetail

	if !utils.IsValidateEmailFormat(email) {
		utils.AddErrorDetail(&details, "email", "le format de l'email est invalide")
	}

	isTaken, err := s.repo.IsEmailTaken(db, email)
	if err != nil {
		return nil, err
	}
	if isTaken {
		utils.AddErrorDetail(&details, "email", "l'email est déjà utilisé")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format email")
	}

	return nil, nil
}

func (s *UserService) ValidateUsername(db *sql.DB, username string) ([]model.ErrorDetail ,error) {
	var details []model.ErrorDetail
	
	isTaken, err := s.repo.IsUsernameTaken(db, username)
	if err != nil {
		return nil,err
	}
	if isTaken {
		utils.AddErrorDetail(&details, "username", "le username est déjà pris")
	}

	if !utils.IsUsernameFormatValidate(username) {
		utils.AddErrorDetail(&details, "username", "le username doit contenir au moins 3 caractères")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format username")
	}
	return nil, nil
}

func (s *UserService) AuthService(c *gin.Context, db *sql.DB, input *model.LoginInput) (*model.User, []model.ErrorDetail, error) {
	var details []model.ErrorDetail
	if det, err := utils.ValidateEmailSignin(input.Email); err != nil || len(det) > 0 {
		return nil, append(details, det...), err
	}

	if det, err := utils.ValidatePassword(input.Password); err != nil || len(det) > 0 {
		return nil, append(details, det...), err
	}	

	user, password, err := s.repo.SelectUserByCredential(db, input.Email)
	if err != nil { 
		utils.AddErrorDetail(&details, "field", "invalid credentials")		
		return nil, details, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(password),[]byte(input.Password))
	if err != nil {
		utils.AddErrorDetail(&details, "field", "invalid credentials")		
		return nil, details, err
	}

	return user, nil, nil
}

