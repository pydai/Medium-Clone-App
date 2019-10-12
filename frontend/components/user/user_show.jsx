import React from 'react';
import { Link } from 'react-router-dom';
import UserStoriesContainer from './user_stories_container';

class UserShow extends React.Component {
  // When do we need to have a constructor? Access to props
  constructor(props) {
    super(props);
    this.state = this.props.followButton;
    this.follow = this.follow.bind(this);
  }

  componentWillMount() {
    this.props.fetchAllStories();
    this.props.fetchUser(this.props.match.params.userId);
    this.props.fetchAllFollowers(this.props.match.params.userId);
    // this.props.fetchUserFollowers(this.props.match.params.userId);
    this.setState({following: this.state.following});
  }

  // If the props are modified before the initial constructor call, update the state.
  // Used for updating Follow to Unfollow when current user is already following.
  componentWillReceiveProps(nextProps) {
    if(nextProps.followButton.following !== this.props.followButton.following) {
      this.setState({following: nextProps.followButton.following});
    }
  }

  follow() {
    event.preventDefault();
    let followState;
    let that = this;
    // If you're following the user, the set the state to 'Unfollow'
    Object.values(this.props.follows).forEach(follow => {
      if (follow.followee.id === that.props.user.id) {
        followState = 'Follow';
        this.props.destroyFollow(this.props.user.id, follow.id);
      }
    })
    if (this.state.following === 'Follow') {
      followState = 'Unfollow';
      this.props.createFollow(this.props.user.id);
    }
    this.setState({following: followState});
  }

  getPosts() {
    // Grab all posts in the db
    let userStories = [];
    Object.values(this.props.stories).forEach(story => {
      if(this.props.user.id === story.author_id){
        userStories.push(story);
      }
    });

    let stories = userStories.map(story => {
      return(
        <UserStoriesContainer 
          key={story.id}
          story={story}
          user={this.props.user}
        />
      )
    });

    if(userStories.length > 0) {
      return (
        <div>
          <div className="user-show-stories-title">
            <h3>Stories</h3>
          </div>
          {stories}
        </div>
      )
    }
    else {
      return (
        <div className="user-no-post-msg">{this.props.user.username} has no posts currently.</div>
      )
    }
  }

  render() {
    if(!this.props.user){
      return null;
    }
    let createStory;
    if(this.props.currentUserId === this.props.user.id){
      createStory = <Link to="/stories/new">
        <button className="user-profile-create-story-btn">Create Story</button>
      </Link>;
    }
    else{
      createStory = null;
    }

    // Follow Button: If the current user is accessing his own page return null. Else, display
    // the button.
    let followBtn;
    if (parseInt(this.props.match.params.userId) === this.props.currentUserId) {
      followBtn = null;
    }
    else {
      followBtn = <button className="user-profile-follow-btn" onClick={this.follow}>{this.state.following}</button>;
    }
    
    debugger
    let followers = 0;
    let following = 0;
    let that = this;
    Object.values(this.props.follows).forEach(follow => {
      if(follow.followee.id === parseInt(that.props.match.params.userId)) {
        followers += 1;
      }
    });

    Object.values(this.props.follows).forEach(follow => {
      if (follow.follower.id === parseInt(that.props.match.params.userId)) {
        following += 1;
      }
    });

    return(
      <div>
        <div className="profile-page-container">
          <nav className="user-profile-nav">
            <div className="user-profile-info">
              <div className="user-profile-user">
                <h1 className="user-profile-username">{this.props.user.username}</h1>

                <div className="follows">
                  <p>
                    {following} Following &nbsp;&nbsp; {followers} Followers
                  </p>
                </div>

                {/* Render Follow/Unfollow depending on the state. */}
                {/* Invoking the function onClick means when the function is being processed,
                 that function is called*/}
                {followBtn}
              </div>

              <div className="user-profile-pic-icon">
                <i className="fas fa-user-circle"></i>
              </div>
            </div>

            {/* If user is logged in, can see Create Story button */}
            <div className="user-profile-create-story">
              {createStory}
            </div>
            <hr />
          </nav>
          {this.getPosts()}
        </div>
      </div>
    )
  }
};

export default UserShow;