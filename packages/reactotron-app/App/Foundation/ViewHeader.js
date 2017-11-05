import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'

const toolbarButton = {
  cursor: 'pointer',
}

const Styles = {
  container: {
    WebkitAppRegion: 'drag',
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
  },
  content: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between',
  },
  left: {
    ...AppStyles.Layout.hbox,
    width: 100,
  },
  right: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  center: {
    ...AppStyles.Layout.vbox,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.foregroundLight,
    textAlign: 'center',
  },
  iconSize: 32,
  toolbarClear: {
    ...toolbarButton,
  },
  toolbarFilter: {
    ...toolbarButton,
    paddingRight: 8,
  },
  searchInput: {
    padding: 10,

    backgroundColor: Colors.backgroundSubtleDark,
    border: 'none',
    marginRight: 16,
    color: Colors.foregroundDark,
    fontSize: 14,
  },

  searchContainer: {
    position: 'relative',
  },

  searchIconSize: 28,
  searchIcon: {
    position: 'absolute',
    top: 6,
    right: 20,
    color: Colors.foregroundDark,
  },
}

export const ViewHeader = props => {
  const { title, left, center, right } = props
  return (
    <div style={Styles.container}>
      <div style={Styles.content}>
        <div style={Styles.left}>{left}</div>
        <div style={Styles.center}>
          {title ? <div style={Styles.title}>{title}</div> : null}
          {center}
        </div>
        <div style={Styles.right}>{right}</div>
      </div>
    </div>
  )
}

export default ViewHeader
