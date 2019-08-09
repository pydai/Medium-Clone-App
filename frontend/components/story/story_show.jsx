import React from 'react';
import ResponseContainer from '../responses/response_container';
import ResponseItems from '../responses/response_items';
import { Link } from 'react-router-dom';
import { monthDay } from '../../util/month_day_util';
import { timeToRead } from '../../util/time_to_read_util';

class StoryShow extends React.Component {
  componentDidMount() {
    this.props.fetchStory(this.props.match.params.storyId);
    this.props.fetchAllResponses(this.props.match.params.storyId);
    window.scroll(0, 0);
  }

  render() {
    let creatingResponses;
    let responses;
    let storyResponses;
    if(!this.props.story){
      return null;
    }

    // Render the write response form for logged in users.
    if(this.props.currentUserId){
      creatingResponses = 
      <ResponseContainer
        story={this.props.story}
      />
    }
    else{
      creatingResponses = null;
    }
    // Get all of the responses for this story.
    responses = Object.values(this.props.responses);
    storyResponses = responses.map(response => {
      if (response.story_id === this.props.story.id) {
        return (
          <ResponseItems
            key={response.id}
            response={response}
            deleteResponse={this.props.deleteResponse}
            currentUserId={this.props.currentUserId}
          />
        )
      }
    })
    var body_text = this.props.story.body;
    var formatted_text_arr = body_text.split("\n");
    let story_txt = formatted_text_arr.map(line => {
      return(
        <div>
          {line}
          <br></br>
          <br></br>
        </div>
      )
    });
    debugger
    return (
      <div className="story-show">
        <div className="story-show-position">
          <div className="story-show-container">
            <header className="story-show-header">
              <h1 className="story-show-title">{this.props.story.title}</h1>

              <div className="story-show-author-div">
                <div className="story-show-profile-pic-icon">
                  <Link to={`/users/${this.props.story.author_id}`}>
                    <i className="fas fa-user-circle"></i>
                  </Link>
                </div>
                <div className="story-show-info">
                  <Link to={`/users/${this.props.story.author_id}`}>
                    <h1 className="story-show-author">{this.props.story.author}</h1>
                  </Link>
                  <div className="story-show-date-time">
                    <h2>{monthDay(this.props.story.created_at)} &#183;&nbsp;</h2>
                    <h2>{timeToRead(`${this.props.story.body}`)} min read</h2>
                  </div>
                </div>
              </div>
            </header>

            <div className="story-show-img">
              <img src={`${this.props.story.image}`} />
            </div>

            {/* <h2 className="story-show-body">{this.props.story.body}</h2> */}
            <h2 className="story-show-body">{story_txt}</h2>

            <footer className="story-show-footer">
              <p className="clap-icon">
                <button><i className='far fa-thumbs-up'></i></button>
              </p>
              <div className="media-icons">
                <div className="twitter-icon">
                  <button><i className="fa fa-twitter"></i></button>
                </div>
                <div className="facebook-icon">
                  <button><i className="fa fa-facebook-official"></i></button>
                </div>
                <div className="bookmark-icon">
                  <button><i className="fa fa-bookmark-o"></i></button>
                </div>
              </div>
            </footer>

            <div className="story-show-response">
              <p className="responses-title">Responses</p>
              {creatingResponses}
              {storyResponses}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StoryShow;