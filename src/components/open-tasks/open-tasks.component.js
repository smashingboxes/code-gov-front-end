import React from 'react'
import Breadcrumbs from 'components/breadcrumbs'
import { map } from '@code.gov/cautious'
import FilterBoxes from 'components/filter-boxes'
import FilterTags from 'components/filter-tags'
import Pagination from 'components/pagination'
import SiteBanner from 'components/site-banner'
import TaskCard from 'components/task-card'
import { scrollToTopOfResults } from 'utils/other'

export default class OpenTasks extends React.Component {
  componentDidMount() {
    const boxes = this.props.boxes || {}
    if (Object.keys(boxes).length === 0) this.props.saveFilterData()
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props)
  }

  onFilterBoxChange(category, values) {
    scrollToTopOfResults()
    this.props.onFilterBoxChange(category, values)
  }

  get counter() {
    const { total } = this.props
    let textContent
    if (total === 0) {
      textContent = 'There are currently no open tasks'
    } else if (total === 1) {
      textContent = 'There is currently 1 open task'
    } else if (total >= 2) {
      textContent = `There are ${total} open tasks`
    } else {
      textContent = 'Loading Tasks'
    }
    return <h3 className="repos-count width-three-quarters">{textContent}</h3>
  }

  updatePage(newPage) {
    scrollToTopOfResults()
    this.props.updatePage(newPage)
  }

  render() {
    const numPages = Math.ceil(this.props.total / this.props.selectedPageSize)
    return (
      <div className="search-results-content">
        <SiteBanner title="Open Tasks" />
        <Breadcrumbs crumbs={[{ text: 'Home', to: '/' }, { text: 'Open Tasks' }]} />
        <div className="search-results-header">
          <div className="width-quarter" />
          {this.counter}
        </div>
        <div className="indented">
          <div id="filter-boxes-section">
            <h2>Filter</h2>

            <FilterBoxes
              boxes={this.props.boxes}
              config={[
                // ['Language', 'languages'],
                ['Federal Agency', 'agencies'],
                ['Skill Level', 'skillLevels'],
                ['Time Required', 'timeRequired'],
                ['Type', 'categories']
              ]}
              onFilterBoxChange={::this.onFilterBoxChange}
            />
          </div>
          <div id="filter-results-section">
            <div className="sort-section">
              <h2>
                <span>Explore Open Tasks</span>
              </h2>
            </div>
            <FilterTags filters={this.props.filterTags} onClick={::this.props.onFilterTagClick} />
            <div className="card-list">
              <div className="card-container">
                <ul className="card-ul">
                  {map(this.props.tasks, task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </ul>
              </div>
              {numPages > 0 && (
                <Pagination
                  count={this.props.total}
                  pagesize={this.props.selectedPageSize}
                  page={this.props.selectedPage}
                  updatePage={::this.updatePage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
