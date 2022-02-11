import { useState } from 'react'

export default function useValidation() {
  const [errors, setErrors] = useState({})
  const currYear = new Date().getFullYear()

  const validate = (e, movie) => {
    e.preventDefault()

    let { name, year, rank, genre1, genre2 } = Object.fromEntries(new FormData(e.target))
    year = parseInt(year)
    rank = parseFloat(rank)

    const temp = {}
    if (!name) temp.name = 'Name cannot be blank!'

    if (rank < 0 || rank > 10) temp.rank = 'Rank is outside the 0 to 10 range!'

    if (isNaN(year)) temp.year = 'Year cannot be empty!'
    else if (year < 1888 || year > currYear) temp.year = 'Year can only be between 1888 and current year!'

    if (movie && movie.name == name && movie.rank == rank && movie.year == year && movie.genre1 == genre1 && movie.genre2 == genre2) {
      temp.name = 'No changes were made!'
    }

    setErrors(temp)

    return {
      movie: {
        name,
        year,
        rank: isNaN(rank) ? null : rank,
        genre1: genre1 ? genre1 : null,
        genre2: genre2 ? genre2 : null,
      },
      isValid: Object.keys(temp).length === 0
    }
  }

  const resetErrors = () => setErrors({})

  return {
    errors,
    validate,
    resetErrors,
  }
}