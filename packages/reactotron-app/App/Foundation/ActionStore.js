import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Empty from '../Foundation/EmptyState'
import { ViewHeader } from './ViewHeader'
import IconEdit from 'react-icons/lib/md/edit'

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
}

@inject('session')
@observer
export class ActionStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: [
        // { name: 'Neat action', input: 'hello: world\nworld: hello' }
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

  render() {
    const { ui } = this.props.session

    return (
      <div style={Styles.container}>
        <ViewHeader title={'Stored actions'} />
        {this.state.actions.length ? <h1>Hello, there!</h1> : this.renderEmpty()}

        <div style={Styles.newButton} onClick={() => ui.openDialog('newAction')}>
          <IconEdit size={32} />
        </div>
      </div>
    )
  }
}
