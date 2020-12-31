const { Thoughts , User , React  } = require('../models');

const ThoughtsController = {
getAllThoughts(req , res) {
    Thoughts.find({})
    .populate({ path: 'reactions', 
select: '-__v' })
    .select('-__v')
    .sort({_id: -1})
        .then(dbThoughtsData => res.json(dbThoughtsData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

createThoughts({ body } , res) {
  Thoughts.create(body)
  .then(dbThoughtsData => {
      User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: dbThoughtsData._id } },
          { new: true }
      )
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
  })
  .catch(err => res.status(400).json(err));
},
updateThoughts({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true }
  )
  .then(dbThoughtsData => {
      if (!dbThoughtsData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
      }
      res.json(dbThoughtsData);
  })
  .catch(err => res.status(400).json(err));
},


deleteThoughts({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id })
      .then(dbThoughtsData => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'No Thoughts found with this id!' });
          return;
  }

  User.findOneAndUpdate(
    {username: dbThoughtsData.username},
  { $pull: { thoughts: params.id} }
  )
  .then(() =>{ res.json({message: 'Deleted!'});

})

.catch(err => res.status(500).json(err));
})
.catch(err => res.status(500).json(err));
},



    getThoughtsById({ params } , res) {
    Thoughts.findOne({ _id: params.id })
    .populate({ path: 'reactions', select: '-__v' })
    .select('-__v')
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({message: 'No thought found with this id'});
            return;
        }
        res.json(dbThoughtsData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

addReaction({ params, body }, res) {
  Thoughts.findOneAndUpdate(
      { _id: params.thoughtsId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
  )
  .then(dbThoughtsData => {
      if (!dbThoughtsData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
      }
      res.json(dbThoughtsData);
  })
  .catch(err => res.status(500).json(err));
},

deleteReaction({ params, body }, res) {
  Thoughts.findOneAndUpdate(
      { _id: params.thoughtsId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
  )
  .then(dbThoughtsData => {
      if (!dbThoughtsData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
      }
      res.json({message: 'Successfully deleted the reaction'});
  })
  .catch(err => res.status(500).json(err));
}

};

module.exports = ThoughtsController;
