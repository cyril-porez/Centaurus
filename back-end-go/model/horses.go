package model

import "time"

type Horses struct {
	Id        int    		`json:"id"`
	Name      string 		`json:"name"`
	Race      string 		`json:"race"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}