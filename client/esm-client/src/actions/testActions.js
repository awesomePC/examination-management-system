export const FETCH_TEST_REQUEST = "FETCH_TEST_REQUEST";
export const FETCH_TEST_SUCCESS = "FETCH_TEST_SUCCESS";
export const FETCH_ATTEMPT_TEST_SUCCESS = "FETCH_ATTEMPT_TEST_SUCCESS";
export const FETCH_TEST_FAILURE = "FETCH_TEST_FAILURE";
export const SUBMIT_TEST_FAILURE = "SUBMIT_TEST_FAILURE";
export const SUBMIT_TEST_SUCCESS = "SUBMIT_TEST_SUCCESS";

// Teacher action types
export const FETCH_TEACHER_TEST_REQUEST = "FETCH_TEACHER_TEST_REQUEST";
export const FETCH_TEACHER_TEST_SUCCESS = "FETCH_TEACHER_TEST_SUCCESS";
export const FETCH_TEACHER_TEST_FAILURE = "FETCH_TEACHER_TEST_FAILURE";

const requestTests = () => {
  return {
    type: FETCH_TEST_REQUEST,
  };
};

const receiveTests = (tests) => {
  return {
    type: FETCH_TEST_SUCCESS,
    tests,
  };
};

const testsError = () => {
  return {
    type: FETCH_TEST_FAILURE,
  };
};
const requestTeacherTests = () => {
  return {
    type: FETCH_TEACHER_TEST_REQUEST,
  };
};

const receiveTeacherTests = (tests) => {
  return {
    type: FETCH_TEACHER_TEST_SUCCESS,
    tests,
  };
};

const testsTeacherError = () => {
  return {
    type: FETCH_TEACHER_TEST_FAILURE,
  };
};
const testSubmitError = () => {
  return {
    type: SUBMIT_TEST_FAILURE,
  };
};
const testSubmitted = (testID) => {
  return {
    type: SUBMIT_TEST_SUCCESS,
    testID: testID,
  };
};

const receiveAttemptTests = (tests) => {
  return {
    type: FETCH_ATTEMPT_TEST_SUCCESS,
    tests,
  };
};

export const fetchAttemptTests = (profileID) => async (dispatch) => {
  dispatch(requestTests());

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  };

  await fetch(`/student/attempt-tests/${profileID}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        dispatch(receiveAttemptTests(data.obj));
        // history.push("/studentHome");
      }
    })
    .catch((error) => {
      //Do something with the error if you want!
      dispatch(testsError());
    });
};

export const fetchTests = (className) => async (dispatch) => {
  dispatch(requestTests());

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  };

  await fetch(`/student/tests/${className}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        dispatch(receiveTests(data.obj));
        // history.push("/studentHome");
      }
    })
    .catch((error) => {
      //Do something with the error if you want!
      dispatch(testsError());
    });
};

export const submitTest = (data) => async (dispatch) => {
  // dispatch(requestTests());
  const {
    testID,
    correct,
    unanswered,
    totalMarks,
    profileID,
    testName,
    firstName,
    lastName,
    wrong,
  } = data;
  const testData = JSON.parse(localStorage.getItem(testID));
  let submitMinutes = testData.rM;
  const submitBy = [
    {
      correct,
      unanswered,
      totalMarks,
      profileID,
      testName,
      firstName,
      lastName,
      wrong,
      submitMinutes,
    },
  ];

  const postedData = {
    submitBy,
    testID,
    testName,
  };
  console.log(postedData);

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(postedData),
  };

  await fetch(`/student/submit-test/${testID}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        dispatch(testSubmitted(testID));
        // history.push("/studentHome");
      }
    })
    .catch((error) => {
      //Do something with the error if you want!
      dispatch(testSubmitError());
    });
};


/* Teacher Actions*/

export const fetchTeacherTests = (profileID) => async (dispatch) => {
  dispatch(requestTeacherTests());

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  };

  await fetch(`/teacher/tests/${profileID}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        dispatch(receiveTeacherTests(data.obj));
        // history.push("/studentHome");
      }
    })
    .catch((error) => {
      //Do something with the error if you want!
      dispatch(testsTeacherError());
    });
};