"""
Script para adicionar nova aba ao dashboard da Casa Goianita no Firestore
"""

# Este é um placeholder - vamos usar o navegador para editar manualmente
# devido às limitações de acesso das credenciais do Firebase

NOVA_ABA_BOTAO = '''<button onclick="openTab('levantamento')" class="tab-btn">Levantamento de dados</button>'''

NOVA_ABA_CONTEUDO = '''
<!-- ABA: Levantamento de dados -->
<div id="levantamento" class="tab-content" style="display:none;">
    <div class="grid gap-8">
        <!-- Módulo 1: Jornada do Anfitrião -->
        <section class="bg-live-card border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-live-accent/30 transition-colors">
            <div class="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold select-none group-hover:text-live-accent transition-colors">01</div>
            <h2 class="text-2xl font-bold text-live-accent mb-6 flex items-center gap-3">
                <span class="bg-live-accent/10 p-2 rounded-lg">📋</span> Jornada do Anfitrião
            </h2>
            
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">1.1 Cadastro de Usuário (Crítico)</h3>
                    <ul class="list-disc pl-5 text-live-muted space-y-2 font-serif">
                        <li><strong class="text-white">Regra de Negócio:</strong> O usuário deve criar um "Cadastro Pessoal" antes de criar a lista.</li>
                        <li><strong class="text-white">Requisito Técnico:</strong> Implementar Validação de E-mail Obrigatória (dupla confirmação ou link de ativação).<br><span class="text-xs opacity-70">Por que? Atualmente, noivas digitam e-mail errado (ex: "gmai.com") e perdem acesso a notificações.</span></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">1.2 Criação da Lista (Setup)</h3>
                    <ul class="list-disc pl-5 text-live-muted space-y-2 font-serif">
                        <li><strong class="text-white">Campos Obrigatórios (Hard Block):</strong> Nome do Casal, Data do Evento, Endereço Completo (com validação CEP) OU Data de Retirada.</li>
                        <li><strong class="text-white">Regras de Datas:</strong> Retirada (Min D+7 dias úteis), Entrega (Bloqueio de datas passadas).</li>
                        <li>
                            <strong class="text-white">Nova Funcionalidade (Wallet):</strong> Checkbox 
                            <code class="bg-black/30 px-2 py-1 rounded text-live-accent text-sm font-mono">[ ] Desejo receber o valor em Crédito</code>.
                            Se marcado, não gera ordem logística, apenas crédito financeiro.
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-lg font-bold text-white mb-2">1.3 Gestão e Edição</h3>
                    <ul class="list-disc pl-5 text-live-muted space-y-2 font-serif">
                        <li><strong class="text-white">Alerta de Alteração:</strong> Se a noiva alterar Data ou Endereço após criação, disparar notificação para o Admin.</li>
                        <li><strong class="text-white">Soft Delete:</strong> Usuário não pode excluir lista se houver vendas vinculadas. Apenas inativar visualização pública, mantendo histórico.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Módulo 2: Jornada do Convidado -->
        <section class="bg-live-card border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-live-accent/30 transition-colors">
             <div class="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold select-none group-hover:text-live-accent transition-colors">02</div>
            <h2 class="text-2xl font-bold text-live-accent mb-6 flex items-center gap-3">
                <span class="bg-live-accent/10 p-2 rounded-lg">🛒</span> Jornada do Convidado
            </h2>

            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">2.1 Busca Inteligente</h3>
                    <p class="text-live-muted font-serif mb-2">Filtros: Nome dos Noivos, Data do Evento. <br>Privacidade: Não expor dados sensíveis.</p>
                </div>

                <div class="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                    <h3 class="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">⚠️ Regra de Endereçamento (Gargalo Crítico)</h3>
                    <p class="text-sm text-live-muted mb-3 font-serif">Atualmente, o checkout puxa o endereço do cadastro do convidado. Requisito Mandatório:</p>
                    <ul class="list-disc pl-5 text-live-muted text-sm space-y-1">
                        <li><strong>Sobrescrever Automática:</strong> Forçar <em>Shipping Address</em> para o endereço da Lista da Noiva.</li>
                        <li><strong>Visualização:</strong> Convidado vê apenas "Entregar no endereço cadastrado pelos noivos".</li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-lg font-bold text-white mb-2">2.3 Sincronização Omnichannel</h3>
                    <ul class="list-disc pl-5 text-live-muted space-y-2 font-serif">
                        <li><strong>Venda Online:</strong> Decrementa estoque geral + Marca item "Comprado" na lista imediatamente.</li>
                        <li><strong>Venda Física:</strong> Vendedor dá baixa no PDV -> Baixa no site em < 5 minutos.</li>
                        <li><strong>Alerta de Duplicidade:</strong> Se qty atingida, exibir modal: <em>"Item já presenteado. Comprar mesmo assim?"</em></li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Módulos 3 & 4 (Grid) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Estoque -->
            <section class="bg-live-card border border-white/10 rounded-xl p-8 hover:border-live-accent/30 transition-colors">
                <h2 class="text-xl font-bold text-live-accent mb-4">📦 Estoque & Logística</h2>
                <ul class="list-disc pl-5 text-live-muted space-y-3 font-serif text-sm">
                    <li><strong>Regra de Ouro:</strong> O e-commerce não pode vender o que não existe fisicamente (salvo modalidade Crédito).</li>
                    <li><strong>Integração ERP:</strong> Consultar <strong>Olist</strong>/Pmenu antes do <em>Add to Cart</em>.</li>
                    <li><strong>Fallback:</strong> Se vender sem estoque, converter auto em Voucher para noiva.</li>
                    <li><strong>Expiração:</strong> Lista disponível até 3 meses pós-evento. Após isso, arquivar auto.</li>
                </ul>
            </section>

            <!-- Financeiro -->
            <section class="bg-live-card border border-white/10 rounded-xl p-8 hover:border-live-accent/30 transition-colors">
                <h2 class="text-xl font-bold text-live-accent mb-4">💳 Financeiro (Wallet)</h2>
                <ul class="list-disc pl-5 text-live-muted space-y-3 font-serif text-sm">
                    <li><strong>Fim dos Vales de Papel:</strong> Centralizar em Painel "Meus Créditos".</li>
                    <li><strong>Entradas:</strong> Devoluções, Trocas, Itens Indisponíveis, Presentes convertidos.</li>
                    <li><strong>Saídas:</strong> Compras no site ou QR Code para uso na loja física.</li>
                    <li><strong>Política de Trocas:</strong> 30 dias após data da compra (NF). Exceção: Troca total de lista gera crédito integral.</li>
                </ul>
            </section>
        </div>

        <!-- Alertas UX -->
        <section class="bg-live-card border-l-4 border-red-500 bg-gradient-to-r from-red-900/20 to-transparent p-6 rounded-r-xl">
            <h2 class="text-xl font-bold text-white mb-4">⚠️ Alertas de UX e Bugs Conhecidos</h2>
            <ul class="list-disc pl-5 text-live-muted space-y-2 font-serif text-sm">
                <li><strong>Bug de Navegação:</strong> "Adicionar à Lista" recarrega página e perde scroll. <strong>Correção:</strong> Usar AJAX/Fetch.</li>
                <li><strong>Bug de SKUs:</strong> Catálogo físico tem SKUs diferentes do online. Necessária tabela De/Para ou unificação no ERP.</li>
            </ul>
        </section>

        <!-- Integrações -->
        <section class="bg-live-card border border-white/10 rounded-xl p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Matriz de Integrações</h2>
            <div class="overflow-x-auto rounded-lg border border-white/10">
                <table class="w-full text-left text-sm text-live-muted">
                    <thead class="bg-black/30 text-live-accent uppercase font-bold text-xs">
                        <tr>
                            <th class="px-6 py-4">Sistema</th>
                            <th class="px-6 py-4">Dado Enviado</th>
                            <th class="px-6 py-4">Dado Recebido</th>
                            <th class="px-6 py-4">Frequência</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5 font-serif">
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4 font-bold text-white">Novo Site</td>
                            <td class="px-6 py-4">Pedido, Baixa na Lista</td>
                            <td class="px-6 py-4">Status Pedido, NF</td>
                            <td class="px-6 py-4"><span class="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Real-time</span></td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4 font-bold text-white">ERP (Olist)</td>
                            <td class="px-6 py-4">Consulta Estoque</td>
                            <td class="px-6 py-4">Qtd. Disponível</td>
                            <td class="px-6 py-4"><span class="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Checkout</span></td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4 font-bold text-white">Gateway Pagto</td>
                            <td class="px-6 py-4">Transação</td>
                            <td class="px-6 py-4">Status (Aprovado/Reprovado)</td>
                            <td class="px-6 py-4"><span class="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Real-time</span></td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4 font-bold text-white">PDV Loja Física</td>
                            <td class="px-6 py-4">Venda Item Lista</td>
                            <td class="px-6 py-4">Atualização de Status na Web</td>
                            <td class="px-6 py-4"><span class="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Real-time</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>            <div class="mt-8 border-t border-white/10 pt-6">
                <h3 class="text-white font-bold mb-4">Próximos Passos Sugeridos para o Desenvolvedor</h3>
                <ol class="list-decimal pl-5 text-live-muted font-serif space-y-2">
                    <li>Mapear a API do ERP <strong>Olist</strong> (endpoints de Estoque e Pedido).</li>
                    <li>Desenhar o Diagrama Entidade-Relacionamento (DER) focando na entidade <code>Lista_Itens</code> e sua relação com Pedidos e Estoque.</li>
                    <li>Prototipar tela de "Wallet/Meus Créditos" para aprovação da <strong>Karinne</strong>.</li>
                </ol>
            </div>
        </section>
    </div>
</div>
'''

print("Conteúdo da nova aba preparado!")
print(f"Tamanho do botão: {len(NOVA_ABA_BOTAO)} caracteres")
print(f"Tamanho do conteúdo: {len(NOVA_ABA_CONTEUDO)} caracteres")
