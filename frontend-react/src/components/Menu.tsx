import {MdOutlineHome } from "react-icons/md";
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd, AiOutlineFileAdd } from 'react-icons/ai';
import {RiPagesLine} from 'react-icons/ri'
import { Link } from 'react-router-dom';

function Submenu() {
  return (
    <ul className="ml-4">
      <li>
        <Link to="/cadastros/fornecedores" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Fornecedores </span>
        </Link>
      </li>
      <li>
        <Link to="/cadastros/unidades" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Unidades de Medida </span>
        </Link>
      </li>
      <li>
        <Link to="/cadastros/tipos" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Tipos de Produtos </span>
        </Link>
      </li>
      <li>
        <Link to="/cadastros/produtos" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Produtos </span>
        </Link>
      </li>
      <li>
        <Link to="/cadastros/composicoes" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Composições </span>
        </Link>
      </li>
      <li>
        <Link to="/cadastros/locais" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Locais de Estoque </span>
        </Link>
      </li>
      <li>
        <Link to="/cadastros/usuarios" className="flex items-center text-gray-700">
            <RiPagesLine size={5} />
            <span className="mx-4 font-medium"> Usuários </span>
        </Link>
      </li>
    </ul>
  );
}

export default function Menu() {

  const [submenuOpen, setSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };


  return (
    <div className="flex flex-col w-64 h-screen overflow-y-auto px-4 py-8 border-r">
      <h2 className="text-blue-800 font-semibold text-center text-3xl"> Sistema da Creche </h2>
      <div className="flex flex-col justify-between mt-6">
        <aside>
          <ul>
            <li className="mb-4">
              <Link to="/inicio" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
                <MdOutlineHome size={20} />
                <span className="mx-4 font-medium"> Início </span>
              </Link>
            </li>
            <li className="mb-4">
              <div
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md cursor-pointer"
                onClick={toggleSubmenu}
              >
                <AiOutlineAppstoreAdd size={20} />
                <span className="mx-4 font-medium"> Cadastros </span>
                <span className="ml-auto">{submenuOpen ? '-' : '+'}</span>
              </div>
              {submenuOpen && <Submenu />}
            </li>
            <li className="mb-4">
              <Link to="/nfe" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
                <AiOutlineFileAdd size={20} />
                <span className="mx-4 font-medium"> Nfe </span>
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/relatorios" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
                <RiPagesLine size={20} />
                <span className="mx-4 font-medium"> Relatórios </span>
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

