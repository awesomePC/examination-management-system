const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Student = require("../model/Student");
const Test = require("../model/Test");
const User = require("../model/User");

/**
 * @method - GET
 * @param - /profile/:profileID
 * @description - Fetch student profile using profileID
 */

router.get("/profile/:profileID", auth, async (req, res) => {
  const profileID = req.params.profileID;

  try {
    await Student.findOne({
      _id: profileID,
    })
      .populate("profileInfo")
      .exec(function (err, obj) {
        if (err) {
          return res.status(400).json({ err });
        } else {
          return res.status(200).json({
            obj,
          });
        }
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching Student Data");
  }
});

/**
 * @method - GET
 * @param - /tests/:studentClass
 * @description - Fetch all the tests that student class assigned
 */

router.get("/tests/:studentClass", auth, async (req, res) => {
  const studentClass = req.params.studentClass;

  try {
    await Test.find({
      className: studentClass,
    }).exec(function (err, obj) {
      if (err) {
        return res.status(400).json({ err });
      } else {
        return res.status(200).json({
          obj,
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching Test Data");
  }
});

/**
 * @method - POST
 * @param - /results/:studentID
 * @description - Fetch student results using studentID
 */

router.post("/results/:studentID", auth, async (req, res) => {
  const studentID = req.params.studentID;
  const { testID } = req.body;

  try {
    await Test.find(
      {
        _id: testID,
      },
      "submitBy -_id",
      function (err, obj) {
        if (err) {
          return res.status(400).json({ err });
        } else {
          const result = obj[0].submitBy.filter((student, index) => {
            return student.id !== studentID;
          });

          return res.status(200).json({
            result,
          });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching Test Data");
  }
});

/**
 * @method - PUT
 * @param - /update-profile/:profileID
 * @description - Update student profile using profileID
 */

router.put("/update-profile/:profileID", auth, async (req, res) => {
  const profileID = req.params.profileID;
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    className,
    section,
  } = req.body;
  try {
    const testData = await User.findOneAndUpdate(
      { _id: profileID },
      { ...req.body },
      function (err, updatedData) {
        if (err) {
          return res.status(400).json({ message: "failed to update profile" });
        } else {
          console.log(updatedData);
          return res.status(200).json({
            message: "profile succesfully updated",
          });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Updating Profile");
  }
});

/**
 * @method - PUT
 * @param - /submit-test/:testID
 * @description - Submit particular test using testID
 */

router.put("/submit-test/:testID", auth, async (req, res) => {
  const testID = req.params.testID;
  const submittedData = req.body.submitBy;

  try {
    await Test.updateOne(
      { _id: testID },
      {
        $addToSet: { submitBy: [...submittedData] },
        attempted: true,
      },
      function (err, updatedData) {
        if (err) {
          return res.status(400).json({ message: "failed to submit test" });
        } else {
          return res.status(200).json({
            message: "test submitted succesfully",
          });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in submitting test data");
  }
});

module.exports = router;
