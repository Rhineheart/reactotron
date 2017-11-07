import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Empty from '../Foundation/EmptyState'
import { ViewHeader } from './ViewHeader'
import IconEdit from 'react-icons/lib/md/edit'
import IconPlay from 'react-icons/lib/md/play-arrow'
import IconDelete from 'react-icons/lib/md/delete-forever'
import IconStarBorder from 'react-icons/lib/md/star-border'
import IconAdd from 'react-icons/lib/md/add'
import * as ncrypto from 'crypto'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },

  addButton: {
    cursor: 'pointer',
  },

  actionList: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  actionListHeader: {
    fontSize: 16,
    color: Colors.heading,
  },

  actionRow: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,

    borderBottom: `1px solid ${Colors.backgroundHighlight}`,
  },

  actionBody: {
    flexGrow: 1,
    flex: 1,
  },

  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionButton: {
    cursor: 'pointer',
    paddingRight: 5,
    paddingLeft: 5,
  },

  actionDateList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  actionDate: {
    fontSize: 10,
    color: Colors.foregroundDark,
    paddingRight: 8,
  },

  buttonSeparator: {
    paddingLeft: 8,
    paddingRight: 8,
  },
}

const getRandomDate = () => new Date(Math.random() * Date.now())
const SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  MONTH = DAY * 30,
  YEAR = DAY * 365

const { floor } = Math
const getRelativeDate = (date, deep = 2) => {
  const now = Date.now()
  const then = date - 0

  const delta = now - then

  console.log(now, then, delta)

  let str = []
  ;[
    { label: 'y', ms: YEAR },
    { label: 'm', ms: MONTH },
    { label: 'w', ms: WEEK },
    { label: 'd', ms: DAY },
    { label: 'h', ms: HOUR },
    { label: 'm', ms: MINUTE },
    { label: 's', ms: SECOND },
  ].reduce((d, t) => {
    if (d < t.ms || str.length >= deep) return d

    const v = floor(d / t.ms)

    str.push(`${v}${t.label}`)

    return d - v * t.ms
  }, delta)

  return (str.join(' ') || '0s') + ' ago'
}

@inject('session')
@observer
export class ActionStore extends Component {
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
    const { ui } = this.props.session
    return (
      <div>
        {ui.unnamedActions.length > 0 ? (
          <div style={Styles.actionList}>
            <div style={Styles.actionListHeader}>Latest unsaved dispatched actions</div>
            <div>{ui.unnamedActions.map(this.renderAction)}</div>
          </div>
        ) : null}
        {ui.storedActions.length > 0 ? (
          <div style={Styles.actionList}>
            <div style={Styles.actionListHeader}>Stored actions</div>
            {ui.storedActions.map(this.renderAction)}
          </div>
        ) : null}
      </div>
    )
  }

  renderAction = (action, key) => {
    const name =
      action.id === undefined
        ? ncrypto
            .createHash('md5')
            .update(action.input)
            .digest('hex')
        : action.id

    const iconSize = 24
    const { ui } = this.props.session
    return (
      <div key={key} style={Styles.actionRow}>
        <div style={Styles.actionBody}>
          <div>{name}</div>
          <div style={Styles.actionDateList}>
            {action.dispatchDate ? (
              <div style={Styles.actionDate}>
                latest dispatch: {getRelativeDate(action.dispatchDate)}
              </div>
            ) : null}
            <div style={Styles.actionDate}>created: {getRelativeDate(action.created)}</div>
          </div>
        </div>
        <div style={Styles.actionButtons}>
          <IconPlay
            style={Styles.actionButton}
            size={iconSize + 6}
            onClick={() => {
              if (!ui.validateAndDispatch(action)) {
                return
              }

              ui.updateDispatchDate(action, key)
            }}
          />
          <IconEdit
            style={Styles.actionButton}
            size={iconSize}
            onClick={() => {
              ui.openDialog('newAction', {
                ...action,
                id: name,
                unnamed: action.id === undefined,
                editingIndex: key,
              })
            }}
          />
          <div style={Styles.buttonSeparator} />
          {action.id === undefined ? (
            <IconStarBorder
              style={Styles.actionButton}
              size={iconSize}
              onClick={() => {
                ui.starAction(
                  {
                    ...action,
                    id: name,
                  },
                  key
                )
              }}
            />
          ) : (
            <IconDelete
              style={Styles.actionButton}
              size={iconSize}
              onClick={() => {
                ui.deleteStoredAction(key)
              }}
            />
          )}
        </div>
      </div>
    )
  }

  render() {
    const { ui } = this.props.session

    return (
      <div style={Styles.container}>
        <ViewHeader
          title={'Stored actions'}
          right={
            <IconAdd
              style={Styles.addButton}
              size={32}
              onClick={() => ui.openDialog('newAction')}
            />
          }
        />
        {ui.unnamedActions.length > 0 || ui.storedActions.length > 0
          ? this.renderActions()
          : this.renderEmpty()}
      </div>
    )
  }
}