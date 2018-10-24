import React from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Button
} from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import moment from 'moment';

const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    marginTop: '40px',
    marginBottom: '40px'
  },
  list: {
    width: '100%',
    margin: '0 auto',
    border: 'solid 1px #000'
  },
  num: {
    fontSize: '50%',
    width: '50px'
  }
};

const paddingTime = num => {
  let str = `${num}`;
  return str.length >= 2 ? str : `0${str}`;
};

const getDate = created_at => {
  const mom = moment(created_at).locale('ja');
  const year = mom.get('year');
  const month = mom.get('month') + 1; // 0 to 11
  const date = paddingTime(mom.get('date'));
  const hour = paddingTime(mom.get('hour'));
  const minute = paddingTime(mom.get('minute'));
  const second = paddingTime(mom.get('second'));
  const time = `${year}/${month}/${date} ${hour}:${minute}:${second}`;
  return time;
};

class CommentList extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.props.getComments(this.props.sortOption);
  }
  handleChange = e => {
    this.props.sortComment(e.target.value, this.props.allComments);
  };
  handleRenew = () => {
    this.props.getComments(this.props.sortOption);
  };
  handleClick = num => () => {
    this.props.addNice(num, this.props.sortOption);
  };
  handlePost = value => {
    this.props.postComment(value);
  };
  render() {
    const { allComments, sortOption } = this.props;
    return (
      <div style={styles.container}>
        <form>
          <TextField
            id="sort-algorithm"
            select
            value={sortOption}
            onChange={this.handleChange}
            helperText="Please select sort Algorithm"
            margin="normal"
            style={{ marginLeft: '20px' }}
            SelectProps={{
              native: true
            }}
          >
            {[
              { value: 1, label: '最新順' },
              { value: 2, label: 'No.順' },
              { value: 3, label: 'いいね順' }
            ].map(option => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </TextField>
          <Button
            variant="outlined"
            aria-label="Renew"
            onClick={this.handleRenew}
            style={{ marginLeft: '20px' }}
          >
            更新
          </Button>
        </form>
        {allComments.length !== 0 ? (
          <List style={styles.list}>
            {allComments.map((v, i) => {
              const time = getDate(v.created_at);
              return (
                <ListItem
                  key={i}
                  role={undefined}
                  dense
                  style={{ width: '100%' }}
                >
                  <ListItemText align={'left'} onClick={this.handleClick(v.id)}>
                    {`No: ${v.id} `} (ID:
                    {v.user_id}) [{time}] <br />
                    {v.content}
                  </ListItemText>
                  <ListItemSecondaryAction style={{ width: '100px' }}>
                    <IconButton
                      aria-label="ThumbUp"
                      onClick={this.handleClick(v.id)}
                    >
                      <ThumbUpIcon />
                      <div style={styles.num}>{v.nice}</div>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default CommentList;
