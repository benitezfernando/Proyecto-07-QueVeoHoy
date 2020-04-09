var con = require("../lib/conexionbd");

module.exports = {
  todasLasPeliculas(req, res) {
    let pagina = parseInt(req.query.pagina);
    let cantidad = parseInt(req.query.cantidad);

    let query = "SELECT * FROM pelicula";
    let sql = "";

    if (req.query.titulo) {
      sql = sql + "titulo Like '%" + req.query.titulo + "%'";
    }

    if (req.query.genero) {
      if (req.query.titulo) {
        sql = sql + " and ";
      }

      sql = sql + "genero_id = " + req.query.genero;
    }

    if (req.query.anio) {
      if (req.query.titulo || req.query.genero) {
        sql = sql + " and ";
      }

      sql = sql + "anio = " + req.query.anio;
    }

    if (sql) {
      query = query + " where " + sql;
    }

    query =
      query +
      " ORDER BY " +
      req.query.columna_orden +
      " " +
      req.query.tipo_orden +
      " limit " +
      ((pagina - 1) * cantidad).toString() +
      "," +
      cantidad.toString();

    con.query(query, function(error, resultado) {
      if (error) {
        return res.status(404).send("Hubo un error en la consulta");
      }
      let peliculas = resultado;

      query = "SELECT count(*) As total FROM pelicula";

      if (sql) {
        query = query + " WHERE " + sql;
      }

      con.query(query, function(error, resultado) {
        if (error) {
          return res.status(404).send("error sql");
        }
        

        let response = {
          peliculas: peliculas,
          total: resultado[0].total
        };

        res.send(JSON.stringify(response));
      });
    });
  },

  cargarGenero(req, res) {
    let query = "SELECT * FROM genero";

    con.query(query, function(error, resultado) {
      if (error) {
        return resultado.status(404).send("Hubo un error en la consulta");
      }
      res.status(200).json({
        generos: resultado
      });
    });
  },

  peliculaId(req, res) {
    let queryActors =
      "SELECT actor.nombre FROM actor_pelicula JOIN actor ON actor_pelicula.actor_id = actor.id where actor_pelicula.pelicula_id = " +req.params.id;
    let queryGenero =
      "SELECT * FROM pelicula JOIN genero ON genero_id = genero.id where pelicula.id = " +
      req.params.id;
    let queryPelicula =
      "SELECT * FROM pelicula where pelicula.id = " + req.params.id;
    let actors;
    let generoNombre;

    con.query(queryActors, function(error, resultado) {
      if (error) {
        return error;
      }
      actors = resultado;
    });

    con.query(queryGenero, function(error, resultado) {
      if (error) {
        return error;
      }
      generoNombre = resultado;
    });

    con.query(queryPelicula, function(error, resultado) {
      if (error) {
        return error;
      }
      
      res.status(200).json({
        pelicula: resultado[0],
        actores: actors,
        genero: generoNombre
      });
    });
  },

  recomendadas(req, res) {
    
    let queryRecomendacion ="SELECT * FROM pelicula ";

    if (req.query.genero) {
      // console.log("genero trae ID:",`"${req.query.genero}"`);
      queryRecomendacion = queryRecomendacion+ "JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = "+`"${req.query.genero}"`;
    }

    if (req.query.anio_inicio && req.query.genero) {
      queryRecomendacion ="SELECT * FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre =" +`"${req.query.genero}"` +" AND pelicula.anio >= " +req.query.anio_inicio;
    }

    if (req.query.puntuacion && req.query.genero) {
      queryRecomendacion ="SELECT * FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre =" +`"${req.query.genero}"` +" AND pelicula.puntuacion >= " +req.query.puntuacion;
    }

    if (req.query.anio_fin && req.query.anio_inicio) {
      queryRecomendacion =
        "SELECT * FROM pelicula WHERE anio >= " +req.query.anio_inicio+" and anio <= " +req.query.anio_fin;
    }

    if (req.query.puntuacion && req.query.genero && req.query.anio_fin && req.query.anio_inicio) {
      queryRecomendacion =
        "SELECT * FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre ="+`"${req.query.genero}"`+" AND pelicula.puntuacion = " +req.query.puntuacion +" and anio >= " +req.query.anio_inicio+" and anio <= " +req.query.anio_fin;
    }

    con.query(queryRecomendacion, function(error, resultado) {
      if (error) {
        
        return res.status(404).send("Hubo un error en la consulta de recomendaciones.");
      }
      
      let response = {
        peliculas: resultado
      };

      res.send(JSON.stringify(response));
    });
  }
};
