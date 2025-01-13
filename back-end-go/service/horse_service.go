package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"back-end-go/utils"
	"database/sql"
)

func CreateHorse(db *sql.DB, horse *model.Horses) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	
	if err := repository.InsertHorse(db, horse); err != nil {
		utils.AddErrorDetail(&details, "test", "test")
		return details, nil
	}
	return nil, nil
}

func UpdateHorse(db *sql.DB, horse *model.Horses, id string) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail

	if err := repository.UpdateHorse(db, horse, id); err != nil {
		utils.AddErrorDetail(&details, "test", "test")
		return details, nil
	}
	return nil, nil
}