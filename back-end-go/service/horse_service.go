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

func GetHorse(db *sql.DB, horse *model.Horses, id string) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail

	if err := repository.GetHorse(db, horse, id); err != nil {
		utils.AddErrorDetail(&details, "test", "test")
		return details, nil
	}
	return nil, nil
} 

func GetHorsesByUserId(db *sql.DB, id string) ([]model.Horses, []utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	rows, err := repository.GetHorsesByUserId(db, id);
	if err != nil {
		utils.AddErrorDetail(&details, "test", "test");
		return  nil, details, err;
	}

	defer rows.Close();

	var horses []model.Horses;

	for rows.Next() {
		var horse model.Horses;
		if err := rows.Scan(&horse.Id, &horse.Name, &horse.Age, &horse.Race); err != nil {
			utils.AddErrorDetail(&details, "repsitory error", "Error lors de la récupération des données");
			return nil, details, err;
		}
		horses = append(horses, horse);
	}

	if err := rows.Err(); err != nil {
		utils.AddErrorDetail(&details, "repsitory error", "Error lors de la résultats");
		return nil, details, err;
	}

	return horses, details, nil;
}