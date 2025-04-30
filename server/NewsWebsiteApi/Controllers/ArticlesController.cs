using Microsoft.AspNetCore.Mvc;
using NewsWebsiteApi.Models;
using NewsWebsiteApi.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace NewsWebsiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService; // Use the interface

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllArticles()
        {
            var articles = await _articleService.GetAllAsync();
            return Ok(articles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticleById(string id)
        {
            var article = await _articleService.GetByIdAsync(id);
            if (article == null)
            {
                return NotFound("Article not found.");
            }
            return Ok(article);
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetArticlesByCategory(string category)
        {
            try
            {
                var articles = await _articleService.GetAllAsync();
                var filteredArticles = articles
                    .Where(a => a.Category != null && a.Category.ToLower() == category.ToLower())
                    .ToList();
                return Ok(filteredArticles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching articles by category: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "ArticleAdmin")]
        public async Task<IActionResult> AddArticle([FromForm] Article article, IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                article.CreatedBy = User.Identity?.Name ?? "Unknown"; // Handle null User.Identity.Name
                var newArticle = await _articleService.CreateAsync(article, image);
                return CreatedAtAction(nameof(GetArticleById), new { id = newArticle.Id }, newArticle);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ArticleAdmin")]
        public async Task<ActionResult<Article>> UpdateArticle(string id, [FromForm] Article updatedArticle, IFormFile? image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                updatedArticle.Id = id;
                updatedArticle.CreatedBy = User.Identity?.Name ?? "Unknown"; // Handle null User.Identity.Name
                var articleToUpdate = await _articleService.UpdateAsync(id, updatedArticle, image);
                return Ok(articleToUpdate);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ArticleAdmin")]
        public async Task<IActionResult> DeleteArticle(string id)
        {
            try
            {
                await _articleService.DeleteAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}