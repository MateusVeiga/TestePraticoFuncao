using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        // A��o para carregar a view de inclus�o de benefici�rio
        public ActionResult Incluir()
        {
            return View();
        }

        // A��o para incluir um novo benefici�rio
        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (bo.VerificarExistenciaBeneficiario(model.CPF, model.IdCliente, 0))
            {
                Response.StatusCode = 400;
                return Json("O CPF informado j� est� cadastrado para este cliente.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(new { success = false, errors = erros });
            }
            else
            {
                model.Id = bo.Incluir(new Beneficiario()
                {
                    CPF = model.CPF,
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });

                return Json(new { success = true, message = "Benefici�rio cadastrado com sucesso", id = model.Id });
            }
        }

        // A��o para alterar um benefici�rio
        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (bo.VerificarExistenciaBeneficiario(model.CPF, model.IdCliente, model.Id))
            {
                Response.StatusCode = 400;
                return Json("O CPF informado j� est� cadastrado para este cliente.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(new { success = false, errors = string.Join(Environment.NewLine, erros) });
            }
            else
            {
                bo.Alterar(new Beneficiario()
                {
                    Id = model.Id,
                    CPF = model.CPF,
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });

                return Json(new { success = true, message = "Benefici�rio alterado com sucesso" });
            }
        }

        [HttpPost]
        public JsonResult BeneficiarioList(long idCliente = 0)
        {
            try
            {
                List<Beneficiario> beneficiarios = new BoBeneficiario().Pesquisa(idCliente)
                    ?? new List<Beneficiario>();

                return Json(new { Result = "OK", Records = beneficiarios});
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetBeneficiario(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            Beneficiario beneficiario = bo.Consultar(id);

            if (beneficiario != null)
            {
                var model = new
                {
                    Id = beneficiario.Id,
                    CPF = beneficiario.CPF,
                    Nome = beneficiario.Nome,
                    IdCliente = beneficiario.IdCliente
                };

                return Json(new { success = true, data = model }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = false, message = "Benefici�rio n�o encontrado." }, JsonRequestBehavior.AllowGet);
        }

        // A��o para excluir um benefici�rio
        [HttpPost]
        public JsonResult Excluir(long id)
        {
            try
            {
                BoBeneficiario bo = new BoBeneficiario();
                bo.Excluir(id);

                return Json(new { success = true, message = "Benefici�rio exclu�do com sucesso" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

    }
}
