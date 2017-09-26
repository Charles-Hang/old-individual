import React,{Component} from 'react';
import ClueBox from './ClueBox.jsx';

export default class BlogCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			articlesCount: 0,
			allPage: '',
			currentPage: '',
		};
		this.limit = 5;
		this.changePage = this.changePage.bind(this);
	}

	componentWillMount() {
		this.getArticles(1,this.limit)
			.then(result => {
				console.log(result);
				const articles = this.transformArticle(result.articles);
				articles.unshift({
					type: 'large',
					name: `${this.props.match.params.name}分类`
				});
				this.setState({
					articles: articles,
					articlesCount: parseInt(result.allCount),
					allPage: Math.ceil(result.allCount / this.limit).toString(),
					currentPage: '1'
				});
			});
	}

	changePage(newPage) {
		this.getArticles(newPage,this.limit)
			.then(result => {
				console.log(result);
				const articles = this.transformArticle(result.articles);
				this.setState({
					articles: articles,
					articlesCount: parseInt(result.allCount),
					allPage: Math.ceil(result.allCount / this.limit).toString(),
					currentPage: newPage.toString()
				});
			});
	}

	getArticles(page,limit) {
		return fetch(`/getArticlesByCategory?page=${page}&limit=${limit}&category=${this.props.match.params.name}`).then(response => {
			return response.json();
		})
	}

	transformArticle(articles) {
		const result = [];
		let year = '';
		articles.forEach(article => {
		 	const urlArr = article.url.split('/');
		 	const date = new Date(article.birthTime);
		 	if(date.getFullYear() != year) {
				year = date.getFullYear();
		 		result.push({
		 			type: 'large',
		 			name: year,
		 		})
		 	}
			const obj = {
				type: 'small',
				name: article.title,
				date: `${date.getMonth() + 1}-${date.getDate()}`,
				url: `/blog/${year}/${date.getMonth() + 1}/${date.getDate()}/${urlArr[urlArr.length - 1]}`
			};
			result.push(obj);
		});
		return result;
	}

	render() {
		return(
			<div>
				<ClueBox data={this.state.articles} />
				{this.state.articlesCount > this.limit &&
					<Pagination pages={this.state.allPage} current={this.state.currentPage} changePage={this.changePage}/>
				}
			</div>
		)
	}
}