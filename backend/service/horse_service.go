package service

import (
	"back-end-go/interfaces"
	"back-end-go/model"
	"back-end-go/shared"
	"back-end-go/utils"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

type HorseService struct {
	repo interfaces.HorseRepository
}

func NewHorseService(repo interfaces.HorseRepository) *HorseService {
    return &HorseService{repo: repo}
}

func (s *HorseService) CreateHorse(db *sql.DB, input *model.HorseInput) (*model.Horses,[]model.ErrorDetail, error) {
	var details []model.ErrorDetail
	
	horse := &model.Horses{
		Name: input.Name,
		Age:  input.Age,
		Race: input.Race,
		FkUserId: input.FkUserId,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	err := s.repo.InsertHorse(db, horse)
	if err != nil {
		utils.AddErrorDetail(&details, "database", "failed to insert horse")
		return nil, details, nil
	}
	return horse, nil, nil
}

func (s *HorseService) UpdateHorse(db *sql.DB, input *model.HorseUpdateInput, horseId int, userId int) (*model.Horses,[]model.ErrorDetail, error) {
	var details []model.ErrorDetail

	horse, err := s.repo.GetHorseById(db, horseId)
	if err != nil {
		utils.AddErrorDetail(&details, "database", "failed to retrieve updated horse")
		return nil, details, err
	}

	if horse.FkUserId != userId {
		utils.AddErrorDetail(&details, "authorization", "You are not allowed to update this horse")
		return nil, details, fmt.Errorf("unauthorized update attempt")
	}

	if err := s.repo.UpdateHorse(db, input, horseId); err != nil {
		utils.AddErrorDetail(&details, "database", "failed to update horse in DB")
		return nil, details, nil
	}
	return horse, nil, nil
}

func (s *HorseService) GetHorse(db *sql.DB, id int) (*model.Horses, []model.ErrorDetail, error) {
	var details []model.ErrorDetail

	horse, err := s.repo.GetHorseById(db, id)
	if err != nil { 
		if errors.Is(err, sql.ErrNoRows) {
			utils.AddErrorDetail(&details, "horse", "Horse not found with provided ID")
			return nil, details, nil
		}
		return nil, nil, err
	}

	return horse, nil, nil
} 

func (s *HorseService) GetHorsesByUserId(db *sql.DB, userId int) ([]model.Horses, []model.ErrorDetail, error) {
	var details []model.ErrorDetail

	horses, err := s.repo.GetHorsesByUserId(db, userId)
	if err != nil {
		utils.AddErrorDetail(&details, "database", "failed to fetch horses for user");
		return  nil, details, err;
	}

	if len(horses) == 0 {
		utils.AddErrorDetail(&details, "horse", "No horses found for user");
		return nil, details, nil
	}

	return horses, details, nil;
}

func (s *HorseService) DeleteHorse(db *sql.DB, id int) error {
	if err := s.repo.DeleteHorse(db, id); err != nil {
		if strings.HasPrefix(err.Error(), "no horse found") {
			return shared.ErrNotFound
		}
		return err
	}

	return nil
}