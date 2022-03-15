import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { useParams } from "react-router-dom";
import { MdPerson } from "react-icons/md";

const Rating = () => {
  const userId = localStorage.getItem("myUserId");
  const { id } = useParams();
  const [ratings, setRatings] = useState([]);
  const [rating, setRating] = useState("");
  const [avarage, setAvarage] = useState(0);

  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      isLoggedIn: state.loginReducer.isLoggedIn,
    };
  });

  const avarageCalc = () => {
    
    setAvarage(7);
    let result = 0;
    for (let i = 0; i < ratings.length; i++) {
      const element = ratings[i];
      console.log(element);
      result += parseInt(element.rating);
    }
    if (true) {
      let num = result / ratings.length;
      setAvarage(num);
      console.log("avarage ", avarage);
    }
  };

  const ratingChanged = (newRating) => {
    console.log(newRating);
    setRating(newRating);
  };

  const createRating = async () => {
    console.log("userId", userId);
    let isVoted = false;
    ratings.forEach((element) => {
      if (element.user_id == userId) {
        return (isVoted = true);
      }
    });
    if (isVoted) {
      return "voted";
    }

    const headers = {
      Authorization: `Bearer ${state.token}`,
    };
    await axios
      .post(
        `http://localhost:5000/rate/${id}`,
        { rating },
        { headers }
      )
      .then((res) => {
        if (res.data.success) {
          getRatings(id);
          console.log("in Create", rating);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRatings = async () => {
    console.log("in get ratings");
    await axios
      .get(`http://localhost:5000/rate/${id}`)
      .then((res) => {
       
        if (res.data.success) {
          setRatings(res.data.results);
        } else {
          setRatings([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("in use effect component");
    getRatings();
  }, []);

  useEffect(() => {
    avarageCalc();
  }, [ratings]);

  useEffect(() => {
    createRating();
  }, [rating]);
 

  return (
    <>
      <ReactStars
        count={5}
        onChange={ratingChanged}
        size={24}
        isHalf={true}
        emptyIcon={<i className="far fa-star"></i>}
        halfIcon={<i className="fa fa-star-half-alt"></i>}
        fullIcon={<i className="fa fa-star"></i>}
        activeColor="#ffd700"
      />
      <span id="votes">{ratings.length} </span>{" "}
      <MdPerson color={"#344055"} size={25} />
      <div className="avarage">
        <span>{avarage.toFixed(1)}</span>
        <i class="fa fa-star" aria-hidden="true"></i>
      </div>
    </>
  );
};

export default Rating;