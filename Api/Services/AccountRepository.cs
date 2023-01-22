using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Expressions;

namespace Api.Data.Services
{
    public class AccountRepository<TEntity> where TEntity : class
    {
        private DbContext _context;

        public DbContext Context
        {
            set
            {

                _context = value;
            }
        }

        public async Task DeleteUser(int Id)
        {
            var user = await _context.Set<TEntity>().FindAsync(Id);
            try
            {
                _context.Set<TEntity>().Remove(user);
            }
            catch (Exception)
            {

            }
        }

        public async Task EditUser(TEntity user)
        {
            try
            {
                _context.Entry<TEntity>(user).State = EntityState.Modified;
            }
            catch (Exception)
            {

            }
        }

        public async Task<IEnumerable<TEntity>> GetAllUsers()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }

        public async Task RegisterUser(TEntity user)
        {
            try
            {
                await _context.Set<TEntity>().AddAsync(user);
            }
            catch (Exception)
            {

            }
        }
        public async Task<TEntity> GetT(string includename, Expression<Func<TEntity, bool>> where)
        {
            var user = await _context.Set<TEntity>().Include(includename).SingleOrDefaultAsync(where);
            return user;
        }

        public async Task<bool> IsExistT(Expression<Func<TEntity, bool>> where)
        {
            if (await _context.Set<TEntity>().AnyAsync(where)) return true;
            else return false;
        }
    }
}
