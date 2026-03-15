package main

import (
	"net/http"
	_"time"
)

func (app *application) healthcheckHandler(w http.ResponseWriter, r *http.Request) {

	// js := `{"status":"available","environment":%q,"version":%q}`
	// js = fmt.Sprintf(js,app.config.env,version)

	// data := map[string]string{
	// 	"status":      "available",
	// 	"environment": app.config.env,
	// 	"version":     version,
	// }

	env := envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": app.config.env,
			"version": version,
		},
	}

	// time.Sleep(4 *time.Second)

	err := app.writeJSON(w, http.StatusOK, env, nil)
	if err != nil {

		app.serverErrorResponse(w,r,err)
		// app.logger.Println(err)
		// http.Error(w, "The server encountered a problem and could  ot process your request", http.StatusInternalServerError)
	}

	// js,err := json.Marshal(data)
	// if err != nil{
	// 	app.logger.Println(err)
	// 	http.Error(w,"The server encountered a problem and could not process your request",http.StatusInternalServerError)
	// 	return
	// }

	// js = append(js,'\n')

	// w.Header().Set("Content-Type","application/json")

	// w.Write([]byte(js))
	// fmt.Fprintln(w, "status: available")
	// fmt.Fprintf(w,"environment:%s\n",app.config.env)
	// fmt.Fprintf(w,"version: %s\n",version)
}

// func (app *application) exampleHandler(w http.ResponseWriter, r *http.Request) {
// 	data := map[string]string{
// 		"hello": "world",
// 	}
// 	// Set the "Content-Type: application/json" header on the response.
// 	w.Header().Set("Content-Type", "application/json")
// 	// Use the json.NewEncoder() function to initialize a json.Encoder instance that
// 	// writes to the http.ResponseWriter. Then we call its Encode() method, passing in
// 	// the data that we want to encode to JSON (which in this case is the map above). If
// 	// the data can be successfully encoded to JSON, it will then be written to our
// 	// http.ResponseWriter.
// 	err := json.NewEncoder(w).Encode(data)
// 	if err != nil {
// 		app.logger.Println(err)
// 		http.Error(w, "The server encountered a problem and could not process your request", http.StatusInternalServerError)
// 	}
// }