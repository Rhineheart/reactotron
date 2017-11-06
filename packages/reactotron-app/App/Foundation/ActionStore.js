import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Empty from '../Foundation/EmptyState'
import { ViewHeader } from './ViewHeader'
import IconEdit from 'react-icons/lib/md/edit'
import IconPlay from 'react-icons/lib/md/play-arrow'
import IconDelete from 'react-icons/lib/md/delete-forever'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  newButton: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    position: 'absolute',
    right: 20,
    bottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tag,
    color: '#fff',
    cursor: 'pointer',
  },

  actionList: {
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
  },

  actionRow: {
      flexDirection: "row",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 10,
  },

  actionButtons: {
      flexDirection: "row",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
  },

  actionButton: {
      cursor: "pointer",
      paddingRight: 5,
      paddingLeft: 5,
  },

  buttonSeparator: {
      paddingLeft: 8,
      paddingRight: 8,
  },
}

@inject('session')
@observer
export class ActionStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: [
        { name: 'Neat action', input: 'hello: world\nworld: hello' },
        { name: 'Neat action', input: 'hello: world\nworld: hello' },
        { name: 'Neat action', input: 'hello: world\nworld: hello' },
        { name: 'Neat action', input: 'hello: world\nworld: hello' },
        { name: 'Neat action', input: 'hello: world\nworld: hello' },
        { name: 'Neat action', input: 'hello: world\nworld: hello' },
      ],
    }
  }

  renderEmpty() {
    return (
      <Empty icon="launch" title="No stored actions">
        <p>
          To start defining an action, use the pen button. Any dispatched actions will show up here
          temporarily.
        </p>
      </Empty>
    )
  }

  renderActions = () => {
      return (
          <div style={Styles.actionList}>
            {this.state.actions.map(this.renderAction)}
          </div>
      );
  }

  renderAction = (action, key) => {
      return (
          <div style={Styles.actionRow}>
            <div>
                {action.name}
            </div>
            <div style={Styles.actionButtons}>
                <IconPlay style={Styles.actionButton} size={32} />
                <IconEdit style={Styles.actionButton} size={32} />
                <div style={Styles.buttonSeparator} />
                <IconDelete style={Styles.actionButton} size={32} />
            </div>
          </div>
      );
  }

  render() {
    const { ui } = this.props.session

    return (
      <div style={Styles.container}>
        <ViewHeader title={'Stored actions'} />
        {this.state.actions.length ? this.renderActions() : this.renderEmpty()}

        <div style={Styles.newButton} onClick={() => ui.openDialog('newAction')}>
          <IconEdit size={32} />
        </div>
      </div>
    )
  }
}
