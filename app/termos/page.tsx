export default function Termos() {
  return (
    <main className="max-w-3xl mx-auto p-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Termos de Uso e Política de Privacidade</h1>
      <p className="text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Sobre este site</h2>
          <p>
            Este site é operado por MALU VEICULOS, tendo como finalidade a divulgação de
            veículos disponíveis para venda e a facilitação do contato entre a empresa e
            potenciais clientes. Ao utilizar este site, você concorda com os termos descritos
            nesta página.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Quais dados coletamos</h2>
          <p>Podemos coletar as seguintes informações quando você utiliza nosso site:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Nome completo</li>
            <li>Número de telefone/WhatsApp</li>
            <li>Data de nascimento e CPF (apenas quando fornecidos voluntariamente, como em solicitações de análise de financiamento)</li>
            <li>Informações sobre o veículo de seu interesse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Como usamos seus dados</h2>
          <p>
            Utilizamos as informações fornecidas exclusivamente para: entrar em contato sobre
            veículos de seu interesse; processar solicitações de simulação de financiamento;
            e melhorar a experiência de navegação em nosso site. Não vendemos, alugamos ou
            compartilhamos seus dados pessoais com terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Contato via WhatsApp</h2>
          <p>
            Ao clicar em botões de "Informar Interesse" ou "Solicitar Análise", você será
            redirecionado ao WhatsApp da nossa loja, com uma mensagem pré-preenchida contendo
            as informações relevantes para o seu atendimento. O envio dessa mensagem é
            voluntário e você pode editá-la ou cancelá-la antes de enviar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Seus direitos</h2>
          <p>
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a
            solicitar acesso, correção ou exclusão dos seus dados pessoais que possuímos.
            Para exercer esses direitos, entre em contato conosco pelos canais informados no
            rodapé deste site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Cookies</h2>
          <p>
            Este site pode utilizar cookies e tecnologias semelhantes para melhorar sua
            experiência de navegação, como lembrar suas preferências de busca. Você pode
            desativar cookies nas configurações do seu navegador, embora isso possa afetar
            algumas funcionalidades do site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que
            você revise esta página regularmente para se manter informado sobre eventuais
            alterações.
          </p>
        </section>
      </div>
    </main>
  );
}