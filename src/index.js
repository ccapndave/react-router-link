import React from 'react'

const { bool, object, string, func } = React.PropTypes

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

function isEmptyObject(object) {
  for (const p in object)
    if (object.hasOwnProperty(p))
      return false

  return true
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name
 * (or the value of its `activeClassName` prop).
 *
 * For example, assuming you have the following route:
 *
 *   <Route path="/posts/:postID" component={Post} />
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along location state and/or query string parameters
 * in the state/query props, respectively.
 *
 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
 * 
 * This updated version of the link component adds two extra parameters:
 * 
 * eventName
 * =========
 * This is the event that the component listens to.  It defaults to `onClick`,
 * but can be set to another event such as `onTouchTap` if you are using the
 * `react-tap-event-plugin` module to get around the iOS 300ms delay.
 * 
 * historyType
 * ===========
 * This can be set to either `push` or `replace`.  It defaults to 'push', and
 * selects when the Link uses `pushState` or `replaceState`.
 */
const Link = React.createClass({

  contextTypes: {
    history: object
  },

  propTypes: {
    activeStyle: object,
    activeClassName: string,
    onlyActiveOnIndex: bool.isRequired,
    to: string.isRequired,
    query: object,
    state: object,
    onClick: func,
    eventName: string.isRequired,
    historyType: string.isRequired
  },

  getDefaultProps() {
    return {
      onlyActiveOnIndex: false,
      className: '',
      style: {},
      eventName: 'onClick',
      historyType: 'push'
    }
  },

  handleClick(event) {
    let allowTransition = true, clickResult

    if (this.props.onClick)
      clickResult = this.props.onClick(event)

    if (isModifiedEvent(event))
      return

    if (clickResult === false || event.defaultPrevented === true)
      allowTransition = false

    event.preventDefault()

    if (allowTransition) {
      if (this.props.historyType === 'push') {
        this.context.history.pushState(this.props.state, this.props.to, this.props.query);
      } else if (this.props.historyType === 'replace') {
        this.context.history.replaceState(this.props.state, this.props.to, this.props.query);
      } else {
        console.error(`Only 'push' and 'replace' are supported as historyTypes`);
      }
    }
  },

  render() {
    const { history } = this.context
    const { activeClassName, activeStyle, onlyActiveOnIndex, to, query, state, onClick, eventName, ...props } = this.props

    //props.onClick = this.handleClick
    props[eventName] = this.handleClick

    // Ignore if rendered outside the context
    // of history, simplifies unit testing.
    if (history) {
      if (activeClassName || (activeStyle != null && !isEmptyObject(activeStyle))) {
        if (history.isActive(to, query, onlyActiveOnIndex)) {
          if (activeClassName)
            props.className += props.className === '' ? activeClassName : ` ${activeClassName}`

          if (activeStyle)
            props.style = { ...props.style, ...activeStyle }
        }
      }
    }

    return React.createElement('a', props)
  }

})

export { Link }